const axios = require("axios");
const fs = require('fs');
const path = require('path');
const LinkedInProfile = require('../models/LinkedInProfile');

exports.scrapeLinkedInKeywords = async (req, res) => {
  try {
    const keywords = req.body.profileUrl;

    const response = await axios.post(
       "https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_l1viktl72bvl7bjuj0&endpoint=https%3A%2F%2Flinkedin-be.obsidiantechno.com%2Fapi%2FscrapeLinkedInDataInsert&format=json&uncompressed_webhook=true&force_deliver=true&include_errors=true",
      JSON.stringify(keywords),
      {
        headers: {
          Authorization: `Bearer ${process.env.BRIGHTDATA_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

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
            linkedin_id: profile.linkedin_id, 
            url: profile.url || '', 
            name: profile.name,
            city: profile.city,
            country_code: profile.country_code,
            position: profile.position,
            about: profile.about,
            educations_details: profile.educations_details,
            experience: profile.experience || [],
            education: profile.education || [],
            activity: profile.activity || [],
            honors_and_awards: profile.honors_and_awards || [],
            similar_profiles: profile.similar_profiles || [],
            bio_links: profile.bio_links || [],
            avatar: profile.avatar,
            followers: profile.followers,
            connections: profile.connections,
            current_company_company_id: profile.current_company_company_id,
            current_company_name: profile.current_company_name,
            location: profile.location,
            input_url: profile.input_url,
            linkedin_num_id: profile.linkedin_num_id,
            banner_image: profile.banner_image,
            default_avatar: profile.default_avatar,
            memorialized_account: profile.memorialized_account,
            first_name: profile.first_name,
            last_name: profile.last_name,
            timestamp: profile.timestamp,
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


exports.getAllLinkedinProfiles = async (req, res) => {
  try {
    // Pagination parameters
    const { page = 1, limit = 100 } = req.query;
    const offset = (page - 1) * limit;

    // Fetch profiles with pagination
    const profiles = await LinkedInProfile.findAll({
      attributes: [
        'id',
        'linkedin_id',
        'name',
        'first_name',
        'last_name',
        'about',
        'educations_details',
        'city',
        'country_code',
        'position',
        'posts',
        'current_company',
        'experience',
        'education',
        'url',
        'input_url',
        'avatar',
        'banner_image',
        'followers',
        'connections',
        'current_company_company_id',
        'current_company_name',
        'location',
        'activity',
        'linkedin_num_id',
        'honors_and_awards',
        'similar_profiles',
        'default_avatar',
        'memorialized_account',
        'bio_links',
        'timestamp',
        'createdAt',
        'updatedAt',
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    // Log to JSON file
    // let fileName;
    // try {
    //   fileName = `linkedin_profiles_${Date.now()}.json`;
    //   const filePath = path.join(__dirname, '../logs/', fileName);
    //   fs.mkdirSync(path.dirname(filePath), { recursive: true });
    //   fs.writeFileSync(filePath, JSON.stringify(profiles, null, 2), 'utf8');
    // } catch (fileError) {
    //   console.error('File Write Error:', {
    //     name: fileError.name,
    //     message: fileError.message,
    //     stack: fileError.stack,
    //   });
    //   // Continue execution even if file writing fails
    // }

    // Get total count for pagination
    const totalCount = await LinkedInProfile.count();

    return res.status(200).json({
      status: true,
      message: 'LinkedIn profiles fetched successfully.',
      data: {
       profiles, 
        total: totalCount,
        page: parseInt(page),
      limit: parseInt(limit),
      }
     
     // file: fileName || null,
    });
  } catch (error) {
    console.error('Get LinkedIn Profiles Error:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    return res.status(500).json({
      status: false,
      message: 'Failed to fetch LinkedIn profiles.',
      error: error.message,
    });
  }
};






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