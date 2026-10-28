# MathWorks & MATLAB Academy Offline Clone

A fully responsive, offline replica of the MathWorks portal and MATLAB Academy platform. Built for localized testing, development, and portfolio showcase.

## 🚀 Key Features

- **Offline Navigation Router (`local_router.js`)**: Intercepts internal links, brand logos, course cards, and tab buttons to keep the entire user experience offline without SSO or external redirects.
- **Interactive Course Dashboard (`index.html`)**: Features MATLAB self-paced online courses, progress bars, and course details.
- **Interactive Certificate Modal**: Integrated modal for previewing and downloading course completion certificates (`certificate.pdf`).
- **Account & Settings Portal (`account.html`)**: Complete user profile, license management, security preferences, and communication settings tabs.
- **Complete Suite of Pages**:
  - Documentation & Help Center (`documentation.html`)
  - MATLAB Central Community (`community.html`)
  - Frequently Asked Questions (`faqs.html`)
  - Customer Support & Contact (`support.html`)
  - Online Training Suite (`ots.html`)
  - Online Services Agreement (`online-services-agreement.html`)
- **Profile Picture Manager (`change_pfp.py`)**: CLI utility to generate custom branded avatars with initials or apply custom photo avatars across all local pages.

---

## 💻 Getting Started

You can run the clone locally using any static web server.

### Option 1: Python HTTP Server
```bash
python3 -m http.server 8000
```
Then open [http://localhost:8000/index.html](http://localhost:8000/index.html) in your browser.

### Option 2: Node.js `serve` / `http-server`
```bash
npx serve .
```

---

## 🛠️ Profile Picture Customization

Use `change_pfp.py` to change the user avatar across all pages:

```bash
# 1. Generate initials avatar (e.g., AN for Aman Nirmal)
python3 change_pfp.py AN

# 2. Or use a custom image file
python3 change_pfp.py /path/to/my_photo.png
```

---

## 📁 Repository Structure

```
├── index.html                           # Main Courses Dashboard & Certificate Modal
├── account.html                         # MathWorks Account & Profile Settings
├── community.html                       # MATLAB Central Community
├── documentation.html                   # Help Center & Documentation
├── faqs.html                            # FAQs
├── support.html                         # Contact & Support
├── ots.html                             # Online Training Suite
├── online-services-agreement.html       # Online Services Agreement
├── local_router.js                      # Central client router & link manager
├── change_pfp.py                        # Profile picture generator
├── certificate.pdf                      # Sample course certificate PDF
├── hc_avatar.png                        # Active profile avatar image
├── 41788712_1784142686681_DEF.jpg       # Default avatar image
│
├── matlab courses/                      # Individual course modules
├── static/                              # Core fonts, media, and styles
├── etc/                                 # Clientlibs & template resources
├── matlabcentral/                       # Community assets
├── account.mathworks.com/               # Account assets
└── *_files/                             # Per-page asset directories
```

---

## ⚖️ Disclaimer
This project is an offline educational and design clone created for learning and demonstration purposes. MathWorks, MATLAB, and Simulink are registered trademarks of The MathWorks, Inc.
