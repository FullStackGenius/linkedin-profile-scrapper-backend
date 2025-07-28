const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

  const LinkedInProfile = sequelize.define('LinkedInProfile', {
    linkedin_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: 'Unique LinkedIn profile ID'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Full name of the profile'
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'First name'
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Last name'
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'City of the profile'
    },
    country_code: {
      type: DataTypes.STRING(2),
      allowNull: true,
      comment: 'Country code (e.g., IN for India)'
    },
    position: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Current job position'
    },
    posts: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Array of posts made by the profile'
    },
    current_company: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Current company details'
    },
    experience: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Work experience details'
    },
    education: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Education details'
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'LinkedIn profile URL'
    },
    input_url: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Input URL used for scraping'
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Profile avatar URL'
    },
    banner_image: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Profile banner image URL'
    },
    activity: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Array of recent activities'
    },
    linkedin_num_id: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Numeric LinkedIn ID'
    },
    honors_and_awards: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Honors and awards'
    },
    similar_profiles: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Array of similar profile IDs'
    },
    default_avatar: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      comment: 'Whether the avatar is default'
    },
    memorialized_account: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      comment: 'Whether the account is memorialized'
    },
    bio_links: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Bio links'
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Timestamp of data collection'
    }
  }, {
    tableName: 'linkedin_profiles',
    timestamps: true,
    comment: 'Stores LinkedIn profile data'
  });


module.exports = LinkedInProfile;