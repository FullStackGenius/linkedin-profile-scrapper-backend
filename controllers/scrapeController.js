const axios = require("axios");
const fs = require('fs');
const path = require('path');
const LinkedInProfile = require('../models/LinkedInProfile');

exports.scrapeLinkedInKeywords = async (req, res) => {
  try {
    const keywords = req.body.profileUrl;

    const response = await axios.post(
      // "https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_l1viktl72bvl7bjuj0&endpoint=https%3A%2F%2Fobsidiantechno.com%2Fabctest%2Fwebhook.php&format=json&uncompressed_webhook=true&force_deliver=true&include_errors=true",
       "https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_l1viktl72bvl7bjuj0&endpoint=https%3A%2F%2Flinkedin-be.obsidiantechno.com%2Fapi%2FscrapeLinkedInDataInsert&format=json&uncompressed_webhook=true&force_deliver=true&include_errors=true",
      JSON.stringify(keywords),
      {
        headers: {
          Authorization: `Bearer ${process.env.BRIGHTDATA_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("BrightData Trigger Response:", response.data);
    // Send basic response
    return res.status(200).json({
      status: true,
      message: "Scraping request sent to BrightData successfully.",
      data: ""
    });
  } catch (error) {
    console.error("BrightData Scraping Error:", error?.response?.data || error.message);

    return res.status(500).json({
      status: false,
      message: "Failed to trigger scraping via BrightData.",
      error: error?.response?.data || error.message
    });
  }
};



exports.scrapeLinkedInDataInsert = async (req, res) => {
  try {
    const profiles = req.body; // expecting an array directly

    if (!Array.isArray(profiles)) {
      return res.status(400).json({ error: 'Input must be an array of profiles' });
    }

    const insertedProfiles = [];

    for (const profile of profiles) {
      try {
        const [record, created] = await LinkedInProfile.findOrCreate({
          where: { linkedin_id: profile.linkedin_id },
          defaults: {
            linkedin_id: profile.linkedin_id, // e.g., "priyanka-mandrekar-3692a4219"
            profile_id: profile.id,           // e.g., same as linkedin_id or a separate field
            url: profile.url || '',           // e.g., https://www.linkedin.com/in/...
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });

        insertedProfiles.push({
          linkedin_id: record.linkedin_id,
          created,
          message: created ? 'Profile inserted' : 'Profile already exists'
        });
      } catch (err) {
        console.error(`Error inserting profile ${profile.linkedin_id}:`, err.message);
      }
    }

    return res.status(200).json({
      message: 'Minimal LinkedIn profile data processed successfully',
      data: insertedProfiles
    });
  } catch (error) {
    console.error('Fatal Error:', error.stack || error);
    return res.status(500).json({ error: 'Failed to process webhook data' });
  }
};




// Webhook endpoint to receive LinkedIn profile data
// exports.scrapeLinkedInDataInsert = async (req, res) => {
//   try {
//     const profiles = req.body.data; // JSON data from webhook
//     if (!Array.isArray(profiles)) {
//       return res.status(400).json({ error: 'Input must be an array of profiles' });
//     }

//     const insertedProfiles = [];
//     for (const profile of profiles) {
//       const [record, created] = await LinkedInProfile.findOrCreate({
//         where: { linkedin_id: profile.linkedin_id },
//         defaults: {
//           linkedin_id: profile.linkedin_id,
//           name: profile.name,
//           first_name: profile.first_name,
//           last_name: profile.last_name,
//           city: profile.city,
//           country_code: profile.country_code,
//           position: profile.position,
//           posts: profile.posts,
//           current_company: profile.current_company,
//           experience: profile.experience,
//           education: profile.education,
//           url: profile.url,
//           input_url: profile.input_url,
//           avatar: profile.avatar,
//           banner_image: profile.banner_image,
//           activity: profile.activity,
//           linkedin_num_id: profile.linkedin_num_id,
//           honors_and_awards: profile.honors_and_awards,
//           similar_profiles: profile.similar_profiles,
//           default_avatar: profile.default_avatar,
//           memorialized_account: profile.memorialized_account,
//           bio_links: profile.bio_links,
//           timestamp: profile.timestamp
//         }
//       });

//       insertedProfiles.push({
//         linkedin_id: record.linkedin_id,
//         created: created,
//         message: created ? 'Profile inserted' : 'Profile already exists'
//       });
//     }

//     res.status(200).json({
//       message: 'Webhook data processed successfully',
//       data: insertedProfiles
//     });
//   } catch (error) {
//     console.error('Error processing webhook data:', error);
//     res.status(500).json({ error: 'Failed to process webhook data' });
//   }
// };


// exports.test123 = async (req, res) => {
//   try {
   
//     return res.status(200).json({
//       status: true,
//       message: "Scraping request sent to BrightData successfully.",
//       data: ""
//     });
//   } catch (error) {
//     console.error("BrightData Scraping Error:", error?.response?.data || error.message);

//     return res.status(500).json({
//       status: false,
//       message: "Failed to trigger scraping via BrightData.",
//       error: error?.response?.data || error.message
//     });
//   }
// };


exports.test123 = async (req, res) => {
  try {
    // Get request data (POST body)
    const requestData = req.body;

    // Define filename with timestamp (optional)
    const fileName = `scrape_input_${Date.now()}.json`;

    // Define path (you can adjust the folder)
    const filePath = path.join(__dirname, '../logs/', fileName);

    // Ensure logs directory exists
    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    // Write JSON data to file
    fs.writeFileSync(filePath, JSON.stringify(requestData, null, 2), 'utf8');

    // Respond success
    return res.status(200).json({
      status: true,
      message: "Data received and saved to JSON file.",
      file: fileName,
    });
  } catch (error) {
    console.error("BrightData Scraping Error:", error?.response?.data || error.message);

    return res.status(500).json({
      status: false,
      message: "Failed to save request data.",
      error: error?.response?.data || error.message
    });
  }
};