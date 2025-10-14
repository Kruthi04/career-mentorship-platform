# MongoDB Atlas Search Setup Guide

This guide will help you set up MongoDB Atlas Search for the CareerHub application to enable powerful search functionality across mentors, users, and sessions.

## 📋 Prerequisites

1. **MongoDB Atlas Account**: You need a MongoDB Atlas account with a cluster
2. **Atlas Search Index**: You'll need to create search indexes for your collections
3. **MongoDB Driver**: The application uses the MongoDB Node.js driver

## 🚀 Setup Steps

### 1. MongoDB Atlas Cluster Setup

1. **Create/Login to MongoDB Atlas Account**

   - Go to [MongoDB Atlas](https://cloud.mongodb.com)
   - Sign up or log in to your account

2. **Create a Cluster** (if you don't have one)

   - Click "Build a Database"
   - Choose "FREE" tier (M0) for development
   - Select your preferred cloud provider and region
   - Click "Create"

3. **Configure Network Access**

   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Add your current IP or use "0.0.0.0/0" for development (not recommended for production)

4. **Create Database User**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Create a username and password
   - Select "Read and write to any database"
   - Click "Add User"

### 2. Create Search Indexes

#### For Mentors Collection

1. **Navigate to Search Indexes**

   - Go to your cluster
   - Click "Search" tab
   - Click "Create Search Index"

2. **Create Index Configuration**

   ```json
   {
     "mappings": {
       "dynamic": true,
       "fields": {
         "fullName": {
           "type": "autocomplete",
           "tokenization": "edgeGram",
           "minGrams": 2,
           "maxGrams": 20
         },
         "professionalTitle": {
           "type": "text",
           "analyzer": "lucene.english"
         },
         "bio": {
           "type": "text",
           "analyzer": "lucene.english"
         },
         "areasOfExpertise": {
           "type": "autocomplete",
           "tokenization": "edgeGram",
           "minGrams": 2,
           "maxGrams": 20
         },
         "skills": {
           "type": "autocomplete",
           "tokenization": "edgeGram",
           "minGrams": 2,
           "maxGrams": 20
         },
         "helpAreas": {
           "type": "autocomplete",
           "tokenization": "edgeGram",
           "minGrams": 2,
           "maxGrams": 20
         },
         "location": {
           "type": "text",
           "analyzer": "lucene.english"
         },
         "yearsOfExperience": {
           "type": "number"
         },
         "hourlyRate": {
           "type": "number"
         },
         "verified": {
           "type": "bool"
         }
       }
     }
   }
   ```

3. **Index Name**: `mentors`

#### For Users Collection

1. **Create another Search Index**

   ```json
   {
     "mappings": {
       "dynamic": true,
       "fields": {
         "name": {
           "type": "autocomplete",
           "tokenization": "edgeGram",
           "minGrams": 2,
           "maxGrams": 20
         },
         "email": {
           "type": "text",
           "analyzer": "lucene.english"
         },
         "userType": {
           "type": "string"
         }
       }
     }
   }
   ```

2. **Index Name**: `users`

#### For Sessions Collection

1. **Create Search Index**

   ```json
   {
     "mappings": {
       "dynamic": true,
       "fields": {
         "title": {
           "type": "text",
           "analyzer": "lucene.english"
         },
         "description": {
           "type": "text",
           "analyzer": "lucene.english"
         },
         "status": {
           "type": "string"
         },
         "sessionType": {
           "type": "string"
         }
       }
     }
   }
   ```

2. **Index Name**: `sessions`

### 3. Environment Configuration

1. **Update your `.env` file**:

   ```env
   # MongoDB Atlas Connection
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority

   # Search Configuration
   SEARCH_ENABLED=true
   SEARCH_DEBOUNCE_MS=300
   ```

2. **Replace placeholders**:
   - `<username>`: Your MongoDB Atlas username
   - `<password>`: Your MongoDB Atlas password
   - `<cluster-url>`: Your cluster connection string
   - `<database>`: Your database name (e.g., `careerhub`)

### 4. Test the Setup

1. **Start your backend server**:

   ```bash
   cd backend
   npm run dev
   ```

2. **Test search endpoints**:

   ```bash
   # Test mentor search
   curl "http://localhost:5050/api/search/mentors?q=software"

   # Test search suggestions
   curl "http://localhost:5050/api/search/suggestions?q=java&type=skills"

   # Test search analytics
   curl "http://localhost:5050/api/search/analytics"
   ```

## 🔧 Advanced Configuration

### Custom Analyzers

You can create custom analyzers for better search results:

```json
{
  "analyzers": {
    "custom_analyzer": {
      "type": "custom",
      "tokenizer": {
        "type": "standard"
      },
      "filters": ["lowercase", "stop", "stemmer"]
    }
  },
  "mappings": {
    "fields": {
      "bio": {
        "type": "text",
        "analyzer": "custom_analyzer"
      }
    }
  }
}
```

### Fuzzy Search Configuration

For better typo tolerance:

```json
{
  "mappings": {
    "fields": {
      "fullName": {
        "type": "autocomplete",
        "tokenization": "edgeGram",
        "minGrams": 2,
        "maxGrams": 20,
        "fuzzy": {
          "maxEdits": 2,
          "prefixLength": 3
        }
      }
    }
  }
}
```

## 🚨 Troubleshooting

### Common Issues

1. **"Index not found" error**

   - Ensure the search index is created and deployed
   - Check the index name matches exactly
   - Wait for index deployment to complete

2. **"Authentication failed" error**

   - Verify your MongoDB Atlas credentials
   - Check network access settings
   - Ensure the database user has proper permissions

3. **"Search not working"**

   - Verify the search index is active
   - Check if data exists in the collection
   - Test with simple queries first

4. **"Slow search performance"**
   - Optimize your search index configuration
   - Consider using compound indexes
   - Monitor Atlas cluster performance

### Debug Commands

```bash
# Check if search indexes exist
curl -X GET "https://cloud.mongodb.com/api/atlas/v1.0/groups/{GROUP_ID}/clusters/{CLUSTER_NAME}/fts/indexes" \
  -H "Authorization: Bearer {API_KEY}"

# Test search query directly
curl -X POST "https://cloud.mongodb.com/api/atlas/v1.0/groups/{GROUP_ID}/clusters/{CLUSTER_NAME}/fts/indexes/{INDEX_NAME}/search" \
  -H "Authorization: Bearer {API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"query": {"text": {"query": "software", "path": "skills"}}}'
```

## 📊 Performance Optimization

### Index Optimization

1. **Use specific field mappings** instead of `"dynamic": true`
2. **Limit autocomplete fields** to essential search terms
3. **Use compound indexes** for complex queries
4. **Monitor index size** and performance

### Query Optimization

1. **Use compound queries** for better relevance
2. **Implement pagination** to limit result sets
3. **Add filters** to reduce search scope
4. **Use scoring** to improve result ranking

## 🔒 Security Considerations

1. **Network Security**

   - Use IP whitelisting in production
   - Enable VPC peering for cloud deployments
   - Use private endpoints when possible

2. **Authentication**

   - Use strong passwords for database users
   - Implement proper JWT token validation
   - Use environment variables for sensitive data

3. **Data Protection**
   - Encrypt sensitive data at rest
   - Implement proper access controls
   - Regular security audits

## 📈 Monitoring and Analytics

### Atlas Search Metrics

Monitor these metrics in MongoDB Atlas:

- **Search Query Performance**: Response times and throughput
- **Index Size**: Storage usage and growth
- **Error Rates**: Failed queries and timeouts
- **Popular Queries**: Most searched terms

### Application Metrics

Track these in your application:

- **Search Volume**: Number of searches per day
- **Click-through Rates**: How often users click search results
- **Search Refinements**: How users modify their searches
- **User Satisfaction**: Search result relevance scores

## 🎯 Next Steps

1. **Implement Search Analytics**: Track popular searches and user behavior
2. **Add Search Filters**: Implement advanced filtering options
3. **Optimize Search Relevance**: Fine-tune scoring and ranking
4. **Add Search Suggestions**: Implement autocomplete and suggestions
5. **Monitor Performance**: Set up alerts for search performance issues

## 📚 Additional Resources

- [MongoDB Atlas Search Documentation](https://docs.atlas.mongodb.com/atlas-search/)
- [Search Index Configuration](https://docs.atlas.mongodb.com/atlas-search/create-index/)
- [Search Query Syntax](https://docs.atlas.mongodb.com/atlas-search/query-syntax/)
- [Performance Best Practices](https://docs.atlas.mongodb.com/atlas-search/best-practices/)

---

**Note**: This setup assumes you're using MongoDB Atlas. If you're using a self-hosted MongoDB instance, you'll need to enable the search feature and configure it differently.

