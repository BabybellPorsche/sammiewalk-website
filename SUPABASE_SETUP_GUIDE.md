# Supabase Setup Guide for SammieWalk

Follow these steps to set up your backend for SammieWalk. It's free and takes about 5 minutes!

## Step 1: Create a Project
1. Go to [database.new](https://database.new) and sign in using GitHub or an email address.
2. Click **"New Project"**.
3. Fill out the form:
   - **Name:** \`SammieWalk\`
   - **Database Password:** Enter a secure password (you won't need to memorize this for our code).
   - **Region:** Choose the region closest to you for the fastest performance.
4. Click **"Create new project"**. It will take about 2-3 minutes for the database to finish setting up.

## Step 2: Get Your API Keys
Once your project finishes setting up, you need to grab two keys to link your React app to the database:
1. In the Supabase dashboard sidebar (on the left), click on the **⚙️ Settings** icon (usually at the very bottom).
2. Click on **API** in the settings menu.
3. You will see a section called **Project URL**. Copy the \`URL\` value.
4. Below that, in the **Project API keys** section, copy the \`anon\` / \`public\` key.

## Step 3: Add Keys to Your Project
Now, let's put those keys into your local project.

1. Open your code editor where the \`SammieWalk-react\` project is open.
2. In the very root folder of the project (the same place as \`package.json\`), create a new file named exactly: \`.env.local\`
3. Paste the following into that file, replacing the placeholder text with the actual URL and Key you copied:

\`\`\`env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=ey...your-long-anon-key...
\`\`\`

## Step 4: Let me know!
Once you have saved the \`.env.local\` file, reply to me indicating you're done, and I'll proceed with writing the code to connect everything!
