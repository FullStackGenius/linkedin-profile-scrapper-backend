const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const LinkedInUserData = sequelize.define('LinkedInUserData', {
error: {
    type: DataTypes.STRING,
    allowNull: true
  },
  profileUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  headline: {
    type: DataTypes.STRING,
    allowNull: true
  },
  additionalInfo: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  connectionDegree: {
    type: DataTypes.STRING,
    allowNull: true
  },
  profileImageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  vmid: {
    type: DataTypes.STRING,
    allowNull: true
  },
  query: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: true
  },
  sharedConnections: {
    type: DataTypes.STRING,
    allowNull: true
  },
  company: {
    type: DataTypes.STRING,
    allowNull: true
  },
  companyUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  industry: {
    type: DataTypes.STRING,
    allowNull: true
  },
  company2: {
    type: DataTypes.STRING,
    allowNull: true
  },
  companyUrl2: {
    type: DataTypes.STRING,
    allowNull: true
  },
  jobTitle: {
    type: DataTypes.STRING,
    allowNull: true
  },
  jobDateRange: {
    type: DataTypes.STRING,
    allowNull: true
  },
  jobTitle2: {
    type: DataTypes.STRING,
    allowNull: true
  },
  jobDateRange2: {
    type: DataTypes.STRING,
    allowNull: true
  },
  school: {
    type: DataTypes.STRING,
    allowNull: true
  },
  schoolDegree: {
    type: DataTypes.STRING,
    allowNull: true
  },
  schoolDateRange: {
    type: DataTypes.STRING,
    allowNull: true
  },
  searchAccountFullName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  searchAccountProfileId: {
    type: DataTypes.STRING,
    allowNull: true
  },
   followersCount: {
    type: DataTypes.INTEGER,
    allowNull: true,
    
  },
   connectionsCount: {
    type: DataTypes.INTEGER,
    allowNull: true,
   
  }
}, {
  tableName: 'linkedin_user_data',
  underscored: true,
  timestamps: true
});

module.exports = LinkedInUserData;
