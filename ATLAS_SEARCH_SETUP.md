# MongoDB Atlas Search Setup Guide

## 🎯 Overview
This guide will help you set up MongoDB Atlas Search for your Career Hub application.

## 📋 Prerequisites
- MongoDB Atlas cluster (you already have this)
- Access to Atlas dashboard
- Your cluster: `cluster0.jrioimn.mongodb.net`

## 🔧 Step 1: Create Search Indexes

### 1.1 Mentor Search Index
1. Go to [MongoDB Atlas Dashboard](https://cloud.mongodb.com)
2. Navigate to: **Search** → **Create Index**
3. Select your cluster: `Cluster0`
4. Database: `career-mentorship-platform`
5. Collection: `mentors`
6. Index Name: `mentor-search-index`
7. Use **JSON Editor** and paste this configuration:

```json
{
  "mappings": {
    "dynamic": false,
    "fields": {
      "fullName": {
        "type": "string",
        "analyzer": "lucene.standard"
      },
      "professionalTitle": {
        "type": "string",
        "analyzer": "lucene.standard"
      },
      "bio": {
        "type": "string",
        "analyzer": "lucene.standard"
      },
      "areasOfExpertise": {
        "type": "string",
        "analyzer": "lucene.standard"
      },
      "skills": {
        "type": "string",
        "analyzer": "lucene.standard"
      },
      "helpAreas": {
        "type": "string",
        "analyzer": "lucene.standard"
      },
      "location": {
        "type": "string",
        "analyzer": "lucene.standard"
      },
      "yearsOfExperience": {
        "type": "number"
      },
      "hourlyRate": {
        "type": "number"
      },
      "verified": {
        "type": "boolean"
      },
      "offerFreeIntro": {
        "type": "boolean"
      }
    }
  }
}
```

### 1.2 User Search Index
1. Create another index for `users` collection
2. Index Name: `user-search-index`
3. Configuration:

```json
{
  "mappings": {
    "dynamic": false,
    "fields": {
      "fullName": {
        "type": "string",
        "analyzer": "lucene.standard"
      },
      "email": {
        "type": "string",
        "analyzer": "lucene.standard"
      },
      "bio": {
        "type": "string",
        "analyzer": "lucene.standard"
      },
      "skills": {
        "type": "string",
        "analyzer": "lucene.standard"
      },
      "interests": {
        "type": "string",
        "analyzer": "lucene.standard"
      }
    }
  }
}
```

### 1.3 Session Search Index
1. Create another index for `sessions` collection
2. Index Name: `session-search-index`
3. Configuration:

```json
{
  "mappings": {
    "dynamic": false,
    "fields": {
      "title": {
        "type": "string",
        "analyzer": "lucene.standard"
      },
      "description": {
        "type": "string",
        "analyzer": "lucene.standard"
      },
      "status": {
        "type": "string",
        "analyzer": "lucene.standard"
      },
      "sessionType": {
        "type": "string",
        "analyzer": "lucene.standard"
      }
    }
  }
}
```

## ⏱️ Step 2: Wait for Index Creation
- Index creation takes 2-5 minutes
- You'll see status change from "Building" to "Ready"
- Don't proceed until all indexes are "Ready"

## 🧪 Step 3: Test the Setup
Run the test script to verify everything works:

```bash
cd backend
node scripts/test-search.js
```

## 🚀 Step 4: Update Your Application
The search service is already configured to use Atlas Search. Once indexes are ready, your search will automatically work!

## 🔍 Step 5: Test Search Functionality
1. Go to: `http://localhost:5173/search`
2. Try searching for mentors
3. Test filters and autocomplete

## 🛠️ Troubleshooting

### Error: "$meta sort by 'searchScore' metadata is not supported"
- **Cause**: Atlas Search indexes not created yet
- **Solution**: Wait for indexes to be "Ready" in Atlas dashboard

### Error: "Index not found"
- **Cause**: Wrong index name or collection
- **Solution**: Verify index names match exactly

### No search results
- **Cause**: Data not indexed yet
- **Solution**: Wait 5-10 minutes after index creation

## 📊 Expected Results
After setup, you should see:
- ✅ Fast full-text search
- ✅ Autocomplete suggestions
- ✅ Filtered results
- ✅ Relevance scoring
- ✅ Typo tolerance

## 🎉 Success!
Once all indexes are ready, your search will be lightning fast and feature-rich!

