const axios = require("axios");
const LinkedInUserData = require("../models/LinkedInUserData");

exports.scrapeLinkedInProfiles = async (req, res) => {
  try {
    const { spreadsheetUrl } = req.body;

    // Validate required input
    if (!spreadsheetUrl) {
      return res.status(400).json({
        status: "error",
        message: "spreadsheetUrl is required.",
      });
    }

    const headers = {
      "X-Phantombuster-Key": process.env.API_KEY,
      "Content-Type": "application/json",
    };

    // Step 1: Launch Phantom
    const launchResponse = await axios.post(
      "https://api.phantombuster.com/api/v2/agents/launch",
      {
        id: process.env.PHANTOM_PROFILE_SCRAPER_ID,
        argument: {
          spreadsheetUrl,
          sessionCookie: process.env.LINKEDIN_SESSION_COOKIE,
          numberOfLinesPerLaunch: 10,
          columnName: "profileUrl",
        },
      },
      { headers }
    );

    const containerId = launchResponse.data.containerId;
    if (!containerId) {
      return res.status(500).json({
        status: "error",
        message: "Failed to launch Phantom. containerId not received.",
      });
    }

    console.log(`🚀 Phantom launched. Polling container ID: ${containerId}`);

    await pollPhantomResult(containerId, process.env.API_KEY);

    return res.status(200).json({
      status: "success",
      message: "Scraping completed successfully",
      data: "test",
    });
  } catch (error) {
    console.error(
      "LinkedIn Scraping Error:",
      error?.response?.data || error.message
    );
    return res.status(500).json({
      status: "error",
      message: "An error occurred while scraping LinkedIn data.",
      error: error?.response?.data || error.message,
    });
  }
};

async function pollPhantomResult(containerId, apiKey, pollInterval = 5000) {
  const resultUrl = `https://api.phantombuster.com/api/v2/containers/fetch-result-object?id=${containerId}`;

  return new Promise((resolve, reject) => {
    const poll = async () => {
      try {
        const response = await axios.get(resultUrl, {
          headers: { "X-Phantombuster-Key": apiKey },
        });

        const resultObject = response?.data?.resultObject;

        if (resultObject) {
          const parsedData = JSON.parse(resultObject);
          console.log(parsedData);
          if (Array.isArray(parsedData)) {
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
                  connectionsCount: item.linkedinConnectionsCount || 0,
                },
                {
                  where: { profileUrl },
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
