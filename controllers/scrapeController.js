const axios = require("axios");



exports.scrapeLinkedInKeywords = async (req, res) => {
  try {
    const keywords = req.body.profileUrl;

    const response = await axios.post(
      "https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_l1viktl72bvl7bjuj0&endpoint=https%3A%2F%2Fobsidiantechno.com%2Fabctest%2Fwebhook.php&format=json&uncompressed_webhook=true&force_deliver=true&include_errors=true",
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



// Webhook endpoint to receive LinkedIn profile data
exports.scrapeLinkedInDataInsert = async (req, res) => {
  try {
    const profiles = req.body.data; // JSON data from webhook
    if (!Array.isArray(profiles)) {
      return res.status(400).json({ error: 'Input must be an array of profiles' });
    }

    const insertedProfiles = [];
    for (const profile of profiles) {
      const [record, created] = await LinkedInProfile.findOrCreate({
        where: { linkedin_id: profile.linkedin_id },
        defaults: {
          linkedin_id: profile.linkedin_id,
          name: profile.name,
          first_name: profile.first_name,
          last_name: profile.last_name,
          city: profile.city,
          country_code: profile.country_code,
          position: profile.position,
          posts: profile.posts,
          current_company: profile.current_company,
          experience: profile.experience,
          education: profile.education,
          url: profile.url,
          input_url: profile.input_url,
          avatar: profile.avatar,
          banner_image: profile.banner_image,
          activity: profile.activity,
          linkedin_num_id: profile.linkedin_num_id,
          honors_and_awards: profile.honors_and_awards,
          similar_profiles: profile.similar_profiles,
          default_avatar: profile.default_avatar,
          memorialized_account: profile.memorialized_account,
          bio_links: profile.bio_links,
          timestamp: profile.timestamp
        }
      });

      insertedProfiles.push({
        linkedin_id: record.linkedin_id,
        created: created,
        message: created ? 'Profile inserted' : 'Profile already exists'
      });
    }

    res.status(200).json({
      message: 'Webhook data processed successfully',
      data: insertedProfiles
    });
  } catch (error) {
    console.error('Error processing webhook data:', error);
    res.status(500).json({ error: 'Failed to process webhook data' });
  }
};


exports.test123 = async (req, res) => {
  try {
   
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