# Admin guide — posting to the website without coding

Admin page: **https://tewelde88.github.io/cek-website/admin/**

Everything you save there is published on the website **about 1–2 minutes later**.
(If you don't see the change, refresh the page once more.)

---

## 1. First time only: get your "login key" (5 minutes)

The Admin page logs in with a GitHub **access token** — a private key that allows it to save to the website.

1. Sign in at **github.com** with the account that owns the website (Tewelde88).
2. Open **https://github.com/settings/personal-access-tokens/new**
3. Fill in:
   - **Token name:** `Website admin`
   - **Expiration:** choose a date (e.g. 1 year — you can make a new one later)
   - **Repository access:** *Only select repositories* → choose **cek-website**
   - **Permissions → Repository permissions → Contents:** set to **Read and write**
4. Click **Generate token** and **copy** it (it starts with `github_pat_…`).
   Keep it secret — like a password. Don't send it by email or WhatsApp.
5. Open the Admin page → **Sign In Using Access Token** → paste the token → **Sign In**.

The browser remembers you, so next time the Admin page opens directly.
On a new computer or phone, paste the token again (or create a new one).

> Do **not** use "Sign In with GitHub" — that button needs an extra login server which this free setup does not have.

---

## 2. Post news, an article or an event

1. Admin page → **News & Articles** → **News posts**.
2. Click **Add post** (a new empty post appears at the top).
3. Fill in:
   - **Title** (English) and **Title (Tigrinya)**
   - **Link name** — short, small letters and dashes, e.g. `easter-2027` (must be different for every post)
   - **Date** and **Category** (News / Article / Event)
   - **Short summary** — 1–2 sentences for the news cards
   - **Full text** — leave an **empty line between paragraphs**
4. **Photos**
   - **Cover photo:** click → **Upload** → choose a photo from your computer or phone.
   - **Photo gallery:** click **Add photo** for each picture, upload it and add a caption.
   - Photos are made smaller automatically, so you can upload photos straight from a phone camera.
5. **Videos (optional)** — click **Add video**:
   - **Best:** upload the video to YouTube or Facebook first, then paste its **link**.
   - Or **upload a short video file** (MP4, maximum 50 MB).
6. Click **Save** (top right). Done — check the News page in 1–2 minutes.

The post appears on the **News** page, in the **Gallery** (its photos) and — if it is one of the 3 newest — on the **home page**.

**To change or delete a post:** open it in the list, edit and **Save**; or use the **⋮ / trash** button next to the post, then **Save**.
**Example posts** (marked *EXAMPLE*) can be deleted once you have real posts.

---

## 3. Add a sermon

Admin page → **Sermons** → **Add sermon**: title (English/Tigrinya), year, date, preacher, then any of:
- **Audio recording (MP3)** — upload; visitors can listen on the page.
- **Video link** — YouTube / Facebook.
- **Text (PDF)** — upload.
Save. The newest sermon is shown at the top of the Sermons page and on the home page.

## 4. Add a book or document to the Library

Admin page → **Library** → **Add item**: title, author, year, category, language, then **Upload document (PDF)** *or* paste a **web link**. Optional: a **cover picture**. Save.

## 5. Priests, deaneries, religious communities

Admin page → **Eparchy: Priests, Deaneries, Religious** → open the list you need → **Add** → fill in English and Tigrinya, upload a photo → Save.

## 6. Parishes, chapels, communities, sanctuaries

Admin page → **Parishes, Chapels, Communities, Sanctuaries** → add or edit entries (Mass times, priest, phone, Google Maps link) → Save.

## 7. Contact details

Admin page → **Contact details**: phone, **email** (the contact form sends messages here), WhatsApp number (digits only, with country code, e.g. `2917123456`), office hours, address, offices → Save.

---

## 8. St. Michael’s building project

Open **Building project → St. Michael’s building project**. Change **Progress (%)** and the church drawing on the home page and on the project page fills up to that number. Set each stage to *Done*, *Under way* or *Next*, add construction photos, and write the story of the project. When the stages are real, untick **Stages are still examples**. Press **Save**.

## 9. Other projects

Open **Projects → Projects list** and press **Add project**. Fill in the name, status (planned / under way / completed), progress, a short description and a photo. They appear on the Projects page after St. Michael’s, which is still edited under **Building project**.

## 10. Deanery of each parish

On **Parishes**, fill in **Deanery** for each parish (the same spelling for every parish of one deanery). The Parishes page then shows a button for each deanery to filter the list.

## 11. Eparchy page: bishops, priests, religious communities, history

Open **Eparchy → Eparchy lists**. Each row of the Eparchy page has its own list:

- **Bishops of Keren** — add each late bishop (name, years, photo). Put the current bishop first and tick **Current bishop**. They scroll sideways on the page.
- **Priests** — name, role, parish and photo. The page shows 12 at a time with **Show more**.
- **Religious orders & congregations** — name and photo (shown as a photo card with the name).
- **History** — one entry per event: year, optional exact date (the Ge’ez date is added by itself), title and text. They are sorted by year, so add new years at any time. Tick **Still to be checked** to show “Dates to check”.

Press **Add …** to add, or the bin icon to remove an entry, then **Save**. Untick **Example entry** when an entry is real.

The two seminaries have their own pages (`major-seminary.html`, `minor-seminary.html`), ready to be written.

## Other ways to upload content

| Way | When to use it |
|---|---|
| **Admin page on a computer** | Best for writing longer posts and uploading many photos. |
| **Admin page on a phone** | Works in the phone browser (Chrome/Safari) — good for quick posts with photos taken on the phone. Sign in once with the token. |
| **YouTube / Facebook for videos** | Upload long or large videos there, then paste the link into the post. Keeps the website fast and avoids the 50 MB limit. |
| **"Work with Local Repository"** (on the Admin login screen) | For working on this computer with Chrome or Edge, without internet publishing: choose the website folder, edit, then publish later (ask your web helper). |
| **github.com directly** | Upload or replace a file by hand: open the repository → folder → **Add file → Upload files**. For photos with fixed names, e.g. the home cover photos `images/hero-1.jpg`. |
| **Send to your web helper** | Text + photos by email/WhatsApp, for anything the Admin page doesn't cover (e.g. changing fixed page texts). |

## Several people posting

Each extra editor needs a free GitHub account. Add them at
**https://github.com/Tewelde88/cek-website/settings/access** → **Add people**.
They then create their own token (step 1, choosing *cek-website*) and sign in.

## Tips
- Photo size: phone photos are fine — they are resized automatically.
- Keep videos on YouTube/Facebook when possible; uploaded video files make the website heavier.
- Always fill in **both** English and Tigrinya when you can; if Tigrinya is empty, the English text is shown.
- If something goes wrong, every change is saved in the history on GitHub and can be restored.
