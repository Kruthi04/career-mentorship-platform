# Migration Guide: Phyllo to LinkedIn OAuth

This guide helps you migrate from the Phyllo LinkedIn verification system to LinkedIn OAuth.

## 🎯 Why Migrate to OAuth?

### Benefits of LinkedIn OAuth

- **Simpler Setup**: No third-party service required
- **Better UX**: Familiar OAuth flow for users
- **Cost Effective**: No per-verification costs
- **Direct Integration**: Users authenticate directly with LinkedIn
- **Reduced Dependencies**: Fewer external services to maintain

### What Changed

- Removed Phyllo API integration
- Implemented LinkedIn OAuth 2.0 flow
- Updated user data model
- Modified frontend components
- Updated API endpoints

## 📋 Migration Checklist

### 1. Environment Variables

**Remove these Phyllo variables:**

```env
PHYLLO_BASE_URL=https://api.getphyllo.com
PHYLLO_CLIENT_ID=your-phyllo-client-id
PHYLLO_CLIENT_SECRET=your-phyllo-client-secret
PHYLLO_WEBHOOK_SECRET=your-phyllo-webhook-secret
```

**Add these LinkedIn OAuth variables:**

```env
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
LINKEDIN_REDIRECT_URI=https://your-domain.com/linkedin-callback
```

### 2. LinkedIn App Setup

1. **Create LinkedIn App**

   - Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
   - Create a new app
   - Configure OAuth 2.0 settings

2. **Add Redirect URLs**

   - Development: `http://localhost:5173/linkedin-callback`
   - Production: `https://your-domain.com/linkedin-callback`

3. **Get Credentials**
   - Copy Client ID and Client Secret
   - Add to environment variables

### 3. Database Migration

Run the migration script to update existing user data:

```bash
cd backend
node scripts/migrateToOAuth.js
```

This script will:

- Find users with Phyllo data
- Reset LinkedIn profile fields to OAuth format
- Preserve existing profile information where possible
- Mark all users as needing re-verification

### 4. Code Updates

The following files have been updated:

#### Backend Changes

- `src/models/User.js` - Updated LinkedIn profile schema
- `src/controllers/linkedInController.js` - OAuth implementation (already existed)
- `src/routes/linkedIn.js` - OAuth routes (already existed)

#### Frontend Changes

- `src/components/MentorConnect/MentorSignUp.tsx` - OAuth flow
- `src/components/MentorConnect/LinkedInVerificationStatus.tsx` - OAuth status
- `src/components/MentorConnect/LinkedInCallback.tsx` - OAuth callback (already existed)

### 5. Remove Phyllo Files (Optional)

You can remove these Phyllo-related files if you no longer need them:

```bash
# Remove Phyllo files
rm backend/src/controllers/phylloController.js
rm backend/src/services/phylloService.js
rm backend/src/routes/phyllo.js
rm PHYLLO_INTEGRATION.md
```

**Note:** Keep them for reference if needed.

## 🔄 Migration Process

### Step 1: Prepare Environment

1. **Set up LinkedIn App**

   - Create app in LinkedIn Developers
   - Configure redirect URLs
   - Get OAuth credentials

2. **Update Environment Variables**
   - Remove Phyllo variables
   - Add LinkedIn OAuth variables
   - Update frontend variables

### Step 2: Deploy Backend Changes

1. **Deploy to Render**

   - Push code changes
   - Update environment variables
   - Deploy application

2. **Run Migration Script**
   ```bash
   cd backend
   node scripts/migrateToOAuth.js
   ```

### Step 3: Deploy Frontend Changes

1. **Deploy to Vercel**
   - Push code changes
   - Update environment variables
   - Deploy application

### Step 4: Test Migration

1. **Test OAuth Flow**

   - Register new mentor account
   - Test LinkedIn verification
   - Verify callback handling

2. **Test Existing Users**
   - Check migration script results
   - Verify user data integrity
   - Test re-verification process

## 🧪 Testing the Migration

### Test Cases

1. **New User Registration**

   ```bash
   # Test complete flow
   1. Register as mentor
   2. Check "Verify LinkedIn profile"
   3. Complete OAuth flow
   4. Verify profile data
   ```

2. **Existing User Re-verification**

   ```bash
   # Test migration
   1. Login with existing account
   2. Check LinkedIn verification status
   3. Re-verify with OAuth
   4. Confirm data update
   ```

3. **Error Handling**
   ```bash
   # Test error scenarios
   1. Invalid OAuth code
   2. Expired tokens
   3. Network errors
   4. Invalid redirect URI
   ```

### Verification Checklist

- [ ] LinkedIn OAuth URL generation works
- [ ] OAuth callback processing works
- [ ] User profile data is stored correctly
- [ ] Verification status updates properly
- [ ] Error handling works as expected
- [ ] Existing users can re-verify
- [ ] Frontend components display correctly

## 🚨 Rollback Plan

If you need to rollback to Phyllo:

1. **Revert Code Changes**

   ```bash
   git revert <migration-commit-hash>
   ```

2. **Restore Environment Variables**

   - Remove LinkedIn OAuth variables
   - Restore Phyllo variables

3. **Restore Database**

   - Restore from backup before migration
   - Or manually update user data

4. **Redeploy**
   - Deploy reverted code
   - Update environment variables

## 📊 Migration Impact

### User Impact

- **Existing Users**: Will need to re-verify LinkedIn profiles
- **New Users**: Will use OAuth flow from the start
- **Data Loss**: No data loss, only verification status reset

### System Impact

- **Performance**: Improved (fewer external API calls)
- **Reliability**: Improved (direct LinkedIn integration)
- **Cost**: Reduced (no third-party service fees)
- **Maintenance**: Reduced (fewer dependencies)

## 🆘 Troubleshooting

### Common Issues

1. **OAuth URL Generation Fails**

   - Check LinkedIn app configuration
   - Verify environment variables
   - Ensure redirect URI is configured

2. **Migration Script Errors**

   - Check MongoDB connection
   - Verify User model import
   - Check environment variables

3. **Frontend OAuth Issues**
   - Verify frontend environment variables
   - Check CORS configuration
   - Ensure callback route exists

### Debug Commands

```bash
# Check migration results
cd backend
node -e "
const User = require('./src/models/User');
User.find({'linkedInProfile.phylloAccountId': {$exists: true}})
  .then(users => console.log('Users with Phyllo data:', users.length));
"

# Check OAuth data
node -e "
const User = require('./src/models/User');
User.find({'linkedInProfile.accessToken': {$exists: true}})
  .then(users => console.log('Users with OAuth data:', users.length));
"
```

## 📞 Support

If you encounter issues during migration:

1. **Check Documentation**

   - [LINKEDIN_OAUTH_INTEGRATION.md](./LINKEDIN_OAUTH_INTEGRATION.md)
   - [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)

2. **Review Logs**

   - Backend server logs
   - Frontend console logs
   - Migration script output

3. **Contact Support**
   - Open GitHub issue
   - Check troubleshooting guides
   - Review error messages

## ✅ Post-Migration Checklist

After successful migration:

- [ ] All environment variables updated
- [ ] Migration script completed successfully
- [ ] OAuth flow tested and working
- [ ] Existing users can re-verify
- [ ] Error handling verified
- [ ] Documentation updated
- [ ] Team notified of changes
- [ ] Monitoring configured
- [ ] Backup created
