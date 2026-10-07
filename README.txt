MISI ASK: LEVEL UP!

Vercel deployment:
1. Upload all files in this folder to a GitHub repository.
2. Import the repository into Vercel.
3. Framework Preset: Other / None.
4. Build Command: leave empty.
5. Output Directory: leave empty.
6. Deploy.

Files:
- index.html
- style.css
- script.js

Leaderboard:
- Uses browser localStorage.
- Scores persist on the same browser/device.
- Vercel static hosting alone does not create a shared cross-device leaderboard.
- For global leaderboard, replace the save/load functions with Supabase/Firebase/API storage.

Music:
- Generated with Web Audio API; no MP3 file required.
- Browser usually requires the user to click MULA MISI before audio can start.

Questions:
- 10 checkpoint questions are included based on the visible questions supplied in the uploaded PDF.
