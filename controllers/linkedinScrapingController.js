const axios = require('axios');

exports.scrapeLinkedIn = async (req, res) => {
  try {
    const { spreadsheetUrl } = req.body;

    // Validate required input
    if (!spreadsheetUrl) {
      return res.status(400).json({
        status: 'error',
        message: 'spreadsheetUrl is required.'
      });
    }

    // Step 1: Launch Phantom
    const launchResponse = await axios.post(
      'https://api.phantombuster.com/api/v2/agents/launch',
      {
        id: process.env.PHANTOM_ID,
        arguments: {
          spreadsheetUrl,
          sessionCookie: process.env.LINKEDIN_SESSION_COOKIE, // Add session cookie
          numberOfLinesPerLaunch: 10,
          columnName: 'profileUrl', // Match the spreadsheet column name
        }
      },
      {
        headers: {
          'X-Phantombuster-Key': process.env.PHANTOMBUSTER_API_KEY, // Correct header name
          'Content-Type': 'application/json'
        }
      }
    );

    const containerId = launchResponse.data.containerId;
    if (!containerId) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to launch Phantom. containerId not received.'
      });
    }

    // Step 2: Poll for output (with retry logic)
    let outputResponse;
    for (let i = 0; i < 12; i++) { // Retry up to 60 seconds (5s * 12)
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      outputResponse = await axios.get(
        `https://api.phantombuster.com/api/v2/containers/fetch-output?id=${containerId}&mode=json`,
        {
          headers: {
            'X-Phantombuster-Key': process.env.PHANTOMBUSTER_API_KEY,
            'Content-Type': 'application/json'
          }
        }
      );

      if (outputResponse.data.status === 'done') {
        break;
      }
    }

    if (!outputResponse.data.output) {
      return res.status(500).json({
        status: 'error',
        message: 'Scraping timed out or failed to produce output.'
      });
    }
    // console.log(outputResponse.data.output);

    return res.status(200).json({
      status: true,
      message: 'Scraping completed successfully.',
      //data: parsedData
      data: outputResponse.data.output
    });

  } catch (error) {
    console.error('LinkedIn Scraping Error:', error?.response?.data || error.message);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while scraping LinkedIn data.',
      error: error?.response?.data || error.message
    });
  }
};



