const axios = require("axios");
const fs = require('fs');
const path = require('path');
const LinkedInUserData = require('../models/LinkedInUserData');



exports.phantombusterScraping = async (req, res) => {
  try {
    // 🟢 1. Get required variables from the request body
    const {
    //   apiKey,
    //   agentId,
    //   identityId,
      sessionCookie,
      linkedInSearchUrl,
      numberOfLinesPerLaunch = 10,
      numberOfResultsPerLaunch = 10,
      numberOfResultsPerSearch = 10,
    } = req.body;

    if (!sessionCookie || !linkedInSearchUrl) {
      return res.status(400).json({
        status: false,
        message: "Missing required fields. Please provide: apiKey, agentId, identityId, sessionCookie, linkedInSearchUrl",
      });
    }

    const POLL_INTERVAL_MS = 5000;

    // 🟢 2. Prepare headers and payload
    const headers = {
      "x-phantombuster-key": process.env.API_KEY,
      "Content-Type": "application/json",
    };

    const launchPayload = {
      id: process.env.AGENT_ID,
      argument: {
        category: "People",
        connectionDegreesToScrape: ["2", "3+"],
        numberOfLinesPerLaunch,
        numberOfResultsPerLaunch,
        numberOfResultsPerSearch,
        searchType: "linkedInSearchUrl",
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
        enrichLeadsWithAdditionalInformation: true,
        identities: [
          {
            identityId:process.env.AGENT_ID,
            sessionCookie,
            userAgent:
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
          },
        ],
        linkedInSearchUrl,
      },
    };

    // 🟢 3. Launch the agent
    const launchRes = await axios.post(
      "https://api.phantombuster.com/api/v2/agents/launch",
      launchPayload,
      { headers }
    );

    const containerId = launchRes.data.containerId;
    console.log(`🚀 Agent launched. Polling container ID: ${containerId}`);

    // 🟢 4. Poll for results
    const pollForResult = async () => {
      const resultUrl = `https://api.phantombuster.com/api/v2/containers/fetch-result-object?id=${containerId}`;

      const poll = async () => {
        console.log("⏳ Checking result...");

        try {
          const response = await axios.get(resultUrl, {
            headers: {
              "X-Phantombuster-Key-1": process.env.API_KEY,
            },
          });

          const resultObject = response?.data?.resultObject;


          if (resultObject) {
             const parsedData = JSON.parse(resultObject);
             
           if (Array.isArray(parsedData)) {
      for (const item of parsedData) {
        await LinkedInUserData.create({
          profileUrl: item.profileUrl,
          fullName: item.fullName,
          firstName: item.firstName,
          lastName: item.lastName,
          headline: item.headline,
          additionalInfo: item.additionalInfo,
          location: item.location,
          connectionDegree: item.connectionDegree,
          profileImageUrl: item.profileImageUrl,
          vmid: item.vmid,
          query: item.query,
          category: item.category,
          timestamp: item.timestamp,
          sharedConnections: item.sharedConnections,
          company: item.company,
          companyUrl: item.companyUrl,
          industry: item.industry,
          company2: item.company2,
          companyUrl2: item.companyUrl2,
          jobTitle: item.jobTitle,
          jobDateRange: item.jobDateRange,
          jobTitle2: item.jobTitle2,
          jobDateRange2: item.jobDateRange2,
          school: item.school,
          schoolDegree: item.schoolDegree,
          schoolDateRange: item.schoolDateRange,
          searchAccountFullName: item.searchAccountFullName,
          searchAccountProfileId: item.searchAccountProfileId
        });
      }
    }
            //console.log("✅ Result received:", resultObject);
            return res.status(200).json({
              status: true,
              message: "Scraping successful",
              data: JSON.parse(resultObject)
            });
          } else {
            console.log("⌛ Result not ready yet. Retrying in 5s...");
            setTimeout(poll, process.env.POLL_INTERVAL_MS);
          }
        } catch (err) {
          console.error("❌ Error polling result:", err?.response?.data || err.message);
          setTimeout(poll, process.env.POLL_INTERVAL_MS);
        }
      };

      poll();
    };

    await pollForResult();
  } catch (error) {
    console.error("❌ Phantombuster Scraping Error:", error?.response?.data || error.message);

    return res.status(500).json({
      status: false,
      message: "Failed to trigger scraping via Phantombuster.",
      error: error?.response?.data || error.message,
    });
  }
};


exports.LinkedinProfilesData = async (req, res) => {
  try {
    const { page = 1, limit = 100 } = req.query;
    const offset = (page - 1) * limit;

    // Fetch data from linkedin_user_data table
    const profiles = await LinkedInUserData.findAll({
      attributes: [
        'id',
        'error',
        'profile_url',
        'full_name',
        'first_name',
        'last_name',
        'headline',
        'additional_info',
        'location',
        'connection_degree',
        'profile_image_url',
        'vmid',
        'query',
        'category',
        'timestamp',
        'shared_connections',
        'company',
        'company_url',
        'industry',
        'company2',
        'company_url2',
        'job_title',
        'job_date_range',
        'job_title2',
        'job_date_range2',
        'school',
        'school_degree',
        'school_date_range',
        'search_account_full_name',
        'search_account_profile_id',
        'created_at',
        'updated_at',
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
    });

    const totalCount = await LinkedInUserData.count();

    return res.status(200).json({
      status: true,
      message: 'LinkedIn user data fetched successfully.',
      data: {
        profiles,
        total: totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error('Get LinkedIn User Data Error:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    return res.status(500).json({
      status: false,
      message: 'Failed to fetch LinkedIn user data.',
      error: error.message,
    });
  }
};




