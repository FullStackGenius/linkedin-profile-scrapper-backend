const axios = require('axios');
const LinkedInUserData = require('../models/LinkedInUserData');
// exports.scrapeLinkedInProfiles = async (req, res) => {
//   try {
//     const { spreadsheetUrl } = req.body;

//     // Validate required input
//     if (!spreadsheetUrl) {
//       return res.status(400).json({
//         status: 'error',
//         message: 'spreadsheetUrl is required.'
//       });
//     }

//     // Step 1: Launch Phantom
//     const launchResponse = await axios.post(
//       'https://api.phantombuster.com/api/v2/agents/launch',
//       {
//         id: process.env.PHANTOM_PROFILE_SCRAPER_ID,
//         arguments: {
//           spreadsheetUrl,
//           sessionCookie: process.env.LINKEDIN_SESSION_COOKIE, // Add session cookie
//           numberOfLinesPerLaunch: 10,
//           columnName: 'profileUrl', // Match the spreadsheet column name
//         }
//       },
//       {
//         headers: {
//           'X-Phantombuster-Key': process.env.API_KEY, // Correct header name
//           'Content-Type': 'application/json'
//         }
//       }
//     );

//     const containerId = launchResponse.data.containerId;
//     if (!containerId) {
//       return res.status(500).json({
//         status: 'error',
//         message: 'Failed to launch Phantom. containerId not received.'
//       });
//     }
// return res.status(200).json({
//       status: true,
//       message: 'Scraping completed successfully.',
//       //data: parsedData
//       data: launchResponse.data.containerId
//     });
//     // Step 2: Poll for output (with retry logic)
//     let outputResponse;
//     for (let i = 0; i < 12; i++) { // Retry up to 60 seconds (5s * 12)
//       await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
//       outputResponse = await axios.get(
//         `https://api.phantombuster.com/api/v2/containers/fetch-output?id=${containerId}&mode=json`,
//         {
//           headers: {
//             'X-Phantombuster-Key': process.env.PHANTOMBUSTER_API_KEY,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       if (outputResponse.data.status === 'done') {
//         break;
//       }
//     }

//     if (!outputResponse.data.output) {
//       return res.status(500).json({
//         status: 'error',
//         message: 'Scraping timed out or failed to produce output.'
//       });
//     }
//     // console.log(outputResponse.data.output);

//     return res.status(200).json({
//       status: true,
//       message: 'Scraping completed successfully.',
//       //data: parsedData
//       data: outputResponse.data.output
//     });

//   } catch (error) {
//     console.error('LinkedIn Scraping Error:', error?.response?.data || error.message);
//     return res.status(500).json({
//       status: 'error',
//       message: 'An error occurred while scraping LinkedIn data.',
//       error: error?.response?.data || error.message
//     });
//   }
// };





exports.scrapeLinkedInProfiles = async (req, res) => {
  try {
    const { spreadsheetUrl } = req.body;

    // Validate required input
    if (!spreadsheetUrl) {
      return res.status(400).json({
        status: 'error',
        message: 'spreadsheetUrl is required.'
      });
    }

    const headers = {
      'X-Phantombuster-Key': process.env.API_KEY,
      'Content-Type': 'application/json'
    };

    // Step 1: Launch Phantom
    const launchResponse = await axios.post(
      'https://api.phantombuster.com/api/v2/agents/launch',
      {
        id: process.env.PHANTOM_PROFILE_SCRAPER_ID,
        argument: {
          spreadsheetUrl,
          sessionCookie: process.env.LINKEDIN_SESSION_COOKIE,
          numberOfLinesPerLaunch: 10,
          columnName: 'profileUrl',
        }
      },
      { headers }
    );

    const containerId = launchResponse.data.containerId;
    if (!containerId) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to launch Phantom. containerId not received.'
      });
    }

    console.log(`🚀 Phantom launched. Polling container ID: ${containerId}`);


   await pollPhantomResult(containerId, process.env.API_KEY);

    return res.status(200).json({
            status: 'success',
            message: 'Scraping completed successfully',
            data: "test"
          });

    // Step 2: Poll for results
    // const resultUrl = `https://api.phantombuster.com/api/v2/containers/fetch-result-object?id=${containerId}`;
    // const POLL_INTERVAL_MS = 5000;

    // const poll = async () => {
    //   console.log("⏳ Checking result...");

    //   try {
    //     const response = await axios.get(resultUrl, {
    //       headers: {
    //         'X-Phantombuster-Key': process.env.API_KEY,
    //       },
    //     });

    //     const resultObject = response?.data?.resultObject;

    //     if (resultObject) {
    //       const parsedData = JSON.parse(resultObject);

    //       // Example: Save data to DB
    //       if (Array.isArray(parsedData)) {
    //         for (const item of parsedData) {
    //           // await LinkedInUserData.create({
    //           //   profileUrl: item.profileUrl,
    //           //   fullName: item.fullName,
    //           //   headline: item.headline,
    //           //   location: item.location,
    //           //   company: item.company,
    //           //   jobTitle: item.jobTitle,
    //           //   timestamp: item.timestamp,
    //           // });
    //         }
    //       }

    //       return res.status(200).json({
    //         status: 'success',
    //         message: 'Scraping completed successfully',
    //         data: parsedData
    //       });
    //     } else {
    //       console.log("⌛ Result not ready yet. Retrying in 5s...");
    //       setTimeout(poll, POLL_INTERVAL_MS);
    //     }
    //   } catch (err) {
    //     console.error("❌ Error polling result:", err?.response?.data || err.message);
    //     setTimeout(poll, POLL_INTERVAL_MS);
    //   }
    // };

    // poll();

  } catch (error) {
    console.error('LinkedIn Scraping Error:', error?.response?.data || error.message);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while scraping LinkedIn data.',
      error: error?.response?.data || error.message
    });
  }
};



async function pollPhantomResult(containerId, apiKey, pollInterval = 5000) {
  const resultUrl = `https://api.phantombuster.com/api/v2/containers/fetch-result-object?id=${containerId}`;

  return new Promise((resolve, reject) => {
    const poll = async () => {
      try {
        const response = await axios.get(resultUrl, {
          headers: { 'X-Phantombuster-Key': apiKey },
        });

        const resultObject = response?.data?.resultObject;

        if (resultObject) {
          // resolve(JSON.parse(resultObject));
          const parsedData = JSON.parse(resultObject);
console.log(parsedData);
if (Array.isArray(parsedData)) {
//   for (const item of parsedData) {
//     const profileUrl = item.linkedinProfileUrl+"/"; // match field name

//     if (!profileUrl) continue; // skip if missing URL
// console.log(profileUrl);
//     // Example: item.followerCount & item.connectionCount come from LinkedIn data
//     await LinkedInUserData.update(
//       {
//         followersCount: item.linkedinFollowersCount || 0,
//         connectionsCount: item.linkedinConnectionsCount || 0
//       },
//       {
//         where: { profileUrl: profileUrl }
//       }
//     );
//   }

for (const item of parsedData) {
  let profileUrl = item.linkedinProfileUrl?.trim();

  if (!profileUrl) continue; // skip if missing URL

  // Ensure trailing slash
  if (!profileUrl.endsWith("/")) {
    profileUrl += "/";
  }

  // Ensure "www." in domain
  profileUrl = profileUrl.replace(
    /^https:\/\/(linkedin\.com)/i,
    "https://www.$1"
  );

  console.log(profileUrl);

  await LinkedInUserData.update(
    {
      followersCount: item.linkedinFollowersCount || 0,
      connectionsCount: item.linkedinConnectionsCount || 0
    },
    {
      where: { profileUrl }
    }
  );
}

}
resolve(JSON.parse(resultObject));
        } else {
          setTimeout(poll, pollInterval);
        }
      } catch (err) {
        // You can retry or reject depending on your preference
        setTimeout(poll, pollInterval);
      }
    };
    poll();
  });
}