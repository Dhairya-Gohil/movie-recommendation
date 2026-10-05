# IMPLEMENTATION_DETAILS.md
*MovieFlick - Comprehensive Technical Documentation & Logic Flow*

This document serves as an exhaustive, line-by-line detailed technical breakdown of the MovieFlick platform. It is engineered so that a developer with zero prior context of the codebase can read through and understand exactly how every single feature and system flow was mathematically and logically implemented.

---

## **PHASE 1: Architecture & Data Foundation**

### 01. Project Architecture
The application uses a **Tiered Microservice Architecture** to physically separate concerns, preventing long-running tasks from blocking standard web traffic.
1. **Frontend (React/Vite):** Runs independently (e.g., port 5173). It is entirely responsible for the UI, maintaining local state, conditionally rendering UI elements, and tracking user sessions locally. 
2. **Backend API Gateway (Node.js/Express):** Runs on port 5000. It acts as the central router and auth gatekeeper. The frontend *only* talks to this server.
3. **AI Service (Python/FastAPI):** Runs on port 8000. Express makes internal network calls to this service. Because Node.js is single-threaded, running heavy ML math (like vector distance calculations) would freeze the Node instance for other users. Pushing it to Python keeps Node unblocked and allows utilization of Python's superior data science libraries (`scikit-learn`, `numpy`).

### 02. Database Design
A Relational Database (**MySQL**) was chosen strictly for its ability to enforce data integrity across tables, which is massive in a system with relationships like Users -> Reviews -> Movies.
- **Users Table:** Columns for `id` (Primary Key, Auto Increment), `email`, `password_hash`, and timestamps.
- **Movies Table:** Contains `movie_id` (Primary Key), `title`, `overview`, `release_date`, `vote_average`.
- **Reviews Table:** Contains `id`, `user_id` (Foreign Key referencing Users), `movie_id` (Foreign Key referencing Movies), `rating`, `content` (text), and `sentiment_score` (float). 
- **Watchlists/Favorites Tables:** Pure junction tables mapping `user_id` to `movie_id`. If a user is deleted, their reviews and watchlists cascade and are deleted automatically due to SQL constraint rules.

### 03. Dataset & Movie Data
To populate the massive database, a seeding script (`scripts/syncMovies.js`) was engineered. 
- The script uses the `csv-parse` module to read a massive CSV file sequentially, limiting memory overhead via data streams rather than loading the entire file into RAM at once.
- As a row streams in, the script sanitizes the data (handling missing null values by assigning them empty strings or 0s). 
- It wraps the parsed row variables into an array and executes a `pool.query('INSERT IGNORE INTO movies ... VALUES (?, ?)', dataArray)`. `INSERT IGNORE` ensures that if the script is run multiple times, duplicate movie records throw silent warnings rather than fatal crashes.

### 04. Backend Architecture
The Express API adheres to an **MVC (Model-View-Controller)** pattern, omitting the View since React handles it.
1. **Routes Layer:** Files simply define literal paths (e.g., `router.get('/filter', movieController.filterMovies)`).
2. **Controller Layer:** The `movieController` handles the HTTP lifecycle. It extracts `req.query`, validates the existence of variables, and then triggers the Model. It catches any Promise rejections and returns `res.status(500).json({ error })`.
3. **Model Layer:** The `movieModel.js` file is the ONLY place where raw SQL strings exist. It receives sanitized data from the controller, calls `db.pool.execute()`, and returns the raw rows back to the controller.

---

## **PHASE 2: Core Platform & Security**

### 05. REST APIs
All Express routes adhere strictly to HTTP paradigms. 
- Fetching data relies on `GET` requests (no request bodies used, only URL params/queries).
- Mutating data relies on `POST`, `PUT`, and `DELETE`.
All responses return a JSON object with a boolean `success` flag. Example: `res.status(200).json({ success: true, count: 50, data: moviesArray });`. This consistency allows the frontend to confidently parse responses globally.

### 06. Authentication
The Auth flow is completely custom. 
- **Registration Flow:** React posts `email` and `password`. The Node `authController` first executes `SELECT id FROM users WHERE email = ?`. If a result returns, it explicitly halts the process and throws a `409 Conflict - Email Exists`. If clear, it proceeds to hash the password and `INSERT` the new user.
- **Login Flow:** Node queries the database for the user via email. If found, it pushes both the stored hash and the raw incoming password into the `bcrypt.compare()` method. If true, it mints a JWT token and sends it back to the client.

### 07. Password Security
Raw passwords are never visible. Our node app runs `await bcrypt.hash(password, 10)`. The `10` dictates the salt rounds, meaning the hashing algorithm is iteratively hashed 2^10 times, drastically slowing down brute-force attacks.
- **Forgot Password:** In `authController.js`, a unique short-lived JWT is minted explicitly carrying a `reset` intention flag. Node leverages the `nodemailer` library through `emailService.js`, establishing an SMTP connection to a Gmail account, and emails the user an HTML template containing a hyperlink formatted to `/reset-password?token=XYZ`. Clicking it validates the token signature before permitting a database UPDATE query to the user's password string.

### 08. JWT Authorization
A JSON Web Token (JWT) is utilized to ensure a user is who they claim to be without managing server-side cookies.
- **Minting:** The server signs a payload containing the `user_id` using a high-entropy secret key hidden in a `.env` file (`process.env.JWT_SECRET`).
- **Authorization Middleware:** For protected routes (like posting a review), an Express middleware executes first. It reads the `authorization` header, splitting the string by the space to strip the word `Bearer`. It runs `jwt.verify(token, secret)`. If valid, it decodes the payload, attaches `req.user = decoded`, and calls `next()`. Now the finalizing controller confidently assigns `req.user.id` to the database insert layer, preventing users from forging review associations.

---

## **PHASE 3: Client Experience & Exploration (Frontend)**

### 09. Home Page
When a user navigates to `/`, React mounts the `Home.jsx` component. 
- A `useEffect` hook triggers immediately. It sets a local `isLoading` state to `true`, and fires an Axios GET call to `/api/movies/trending`. 
- Node.js catches this route and queries `SELECT * FROM movies ORDER BY vote_average DESC LIMIT 20`. 
- When Axios resolves, it calls `setTrendingMovies(response.data)`. React re-renders, looping over the `trendingMovies` array using `.map(movie => <MovieCard key={movie.id} {...movie} />)`. `isLoading` is set to `false`, mounting the grid.

### 10. Search
The Navbar contains a controlled input binding its value to a `searchTerm` state. 
- When the user presses Enter, React Router's `useNavigate` hook forcibly changes the URL to `/search?q=Term`. 
- The Search Page component mounts, extracts `?q=Term` using `useSearchParams`, and acts on it via `useEffect`. It hits `/api/movies/search?q=Term`. 
- Node's `movieController.js` trims the term, and constructs an SQL query: `SELECT * FROM movies WHERE title LIKE CONCAT('%', ?, '%')`, passing the term securely to prevent logic injection.

### 11. Filtering
A dedicated Sidebar contains `<select>` tags mapping to local state variables (`genre`, `year`). 
- Changing options triggers a refetch hitting `/api/movies/filter?genre=Action&year=2023`.
- In Note, the Model initializes an array: `const params = []` and a string `let query = "SELECT * FROM movies WHERE 1=1"`. It loops logic: `if(genre) { query += " AND genre LIKE ?"; params.push('%' + genre + '%'); }`. It then fires `pool.execute(query, params)`. This algorithm allows any combination of empty/full filter boxes to synthesize dynamic queries cleanly.

### 12. Sorting
React appends `&sortBy=rating` to the API URL. 
- The Node Controller executes a switch statement based on the string. `case 'rating': query += ' ORDER BY vote_average DESC'`. This relies on an explicitly defined switch block to prevent users from injecting malicious string columns into the `ORDER BY` syntax in SQL.

### 13. Movie Details
Clicking a card pushes the user to `/movie/123`. 
- `MovieDetails.jsx` extracts `123` via `useParams()`. Eagerly fetches `/api/movies/123`.
- Node.js fetches the main movie info: `SELECT * FROM movies WHERE movie_id = 123`. 
- To avoid massive callback chains, Node orchestrates `Promise.all([ movieQuery, reviewsQuery, castQuery ])` resolving all associated data tables concurrently before shaping them into one unified JSON object to hand back to the frontend.

### 14. Cast & Crew
The joined cast data returned from the backend is iterated within a horizontal flex container on the frontend. A ternary operator handles missing imagery: `src={actor.profile_path ? ${baseImgUrl}${actor.profile_path} : '/fallback-person.png'}`. This ensures broken image icons are intercepted before browser rendering. 

### 15. Trailers
Trailers exist as raw string keys (e.g. YouTube video IDs like 'dQw4w9WgXcQ') inside the Movie row in the database. The React component injects this key into a literal iframe string block: `<iframe src={`https://www.youtube.com/embed/${movie.trailer_key}`} allow="autoplay; encrypted-media"></iframe>`.

---

## **PHASE 4: User Engagement & Machine Learning**

### 16 & 17. Favorites & Watchlist
This UX focuses on optimistic UI updates.
- When you click the heart icon on a movie, the component state immediately toggles `isFavorited` to true to provide instant visual feedback. 
- Simultaneously, an async POST request fires to `/api/favorites`. Node extracts `req.user.id` and the `movie_id`, inserting them into the `favorites` junction table. 
- If the Axios call fails (catch block hits), the frontend reverts `isFavorited` back to false and pops an error toast.

### 18 & 19. Reviews and Review Editing/Deletion
- **Posting:** User enters a 4-star rating and text. Hits Submit. Axios POSTs `content` and `rating` to Node. 
- **Deletion:** Clicking a trash icon sends `DELETE /api/reviews/:id`. Crucially, Node does NOT just delete the review. It queries `SELECT user_id FROM reviews WHERE id = ?`. It validates if that matches the JWT user ID. Only if authorized does it execute `DELETE FROM reviews WHERE id = ?`. Preventing malicious cross-user alterations.

### 20. Sentiment Analysis
- Before the `reviews` insert query resolves, the Node.js API halts and sends the review's `content` string via HTTP POST to `http://localhost:8000/sentiment` (the internal Python service). 
- Python runs the `vaderSentiment` package `SentimentIntensityAnalyzer().polarity_scores(text)`. Vader uses a heavy dictionary of adjectives and punctuation rules (e.g. "I hated this movie!!!" registers massively negative due to the exclamation marks). 
- Python returns a `{ compound: 0.85 }` score. Node assigns this float back to the review payload and commits the write to MySQL. The frontend reads this float and renders green UI elements for scores above 0.5 and red elements for negative scores.

### 21. Recommendation System
The system leverages a Content-Based Filtering approach to discover movies similar to what a user enjoys.
- React sends a GET request to `/api/recommendations`. 
- Node acts as a Proxy router, extracting the User ID and forwarding the logic entirely to the Python service `/recommend/{user_id}`.

### 22. User Activity (Matrix Building)
- Python receives the user id, queries the MySQL database directly natively, and selects all the movies the user has rated 4+ stars or added to their favorites. 
- Python aggregates the text metadata (Title + Overviews + Genres) of all these movies into one gigantic "User Profile String". 
- It then pulls the metadata for all 10,000+ movies in the database. 

### 23. Recommendation Scoring 
To compare text mathematically, Python relies on `scikit-learn`:
- It initiates a `TfidfVectorizer` (Term Frequency Inverse Document Frequency). This turns English text into a vast matrix array of numbers, weighing rare unique words heavily and ignoring common words like "the".
- It computes the `cosine_similarity(user_profile_vector, movie_vectors)`. This algorithm literally calculates the geometric angle between the user preference array and every movie array mapped in multi-dimensional space.
- An angle of 0 (Cosine score of 1.0) means an exact match. Python sorts the movies by highest score, filters out movies the user has already watched, and returns an array of the top 10 recommended `movie_id` parameters back to Node.

---

## **PHASE 5: Client Orchestration & Infrastructure**

### 24. Frontend ↔ Backend Communication
The React app relies on a globally configured `axiosInstance`. 
- Instead of manually importing tokens, an Axios Interceptor is constructed in a utility file. 
- Conceptually: `axios.interceptors.request.use((config) => { const token = localStorage.getItem('token'); if(token) config.headers.Authorization = 'Bearer ' + token; return config; })`. This ensures that every single network call globally executes standard auth logic silently behind the scenes.

### 25. React State Management
Prop drilling (passing values down 5 layers of UI) is avoided by enacting the **React Context API**. 
- An `AuthContext.js` wraps the entire root `<App />`. 
- It tracks `currentUser`. Whenever a user logs in, the AuthContext updates, instantly re-rendering the global `<Navbar />` to swap the "Login" button securely with a "Logout" button, without individual components needing to locally listen to `localStorage` changes.

### 26. Error Handling
An Express global Error Handling Middleware sits at the bottom of the `server.js` file.
- Instead of crashing the backend on a failed SQL query, the `catch` blocks call `next(err)`. 
- The middleware reads the object type, sanitizes the traceback (so hackers don't see internal directory paths), and returns a uniform JSON format: `res.status(500).json({ error: 'Internal Server Request', msg: err.message })`. React reads this uniform block and pumps the text natively into a generic UI Toast Notification module.

### 27. Loading States
UI jumping and white-screen dead stops are inherently prevented via isolated Conditional Rendering (`{isLoading ? <Spinner /> : <DataList /> }`). For standard arrays like movie grids, the array maps over a fixed integer loop rendering `<SkeletonCard />` components (gray pulsing blocks) matching exactly the CSS width and height of the finished component, protecting visual Cumulative Layout Shifts (CLS).

### 28. Responsive Design
Mobile scalability relies on **Tailwind CSS Utility Classes** mapped directly on JSX elements. 
- For instance: `<div className="flex flex-col md:flex-row">`. 
- This mathematically forces elements to stack vertically on mobile screens (viewport < 768px). The moment the viewport passes 768px, Tailwind applies CSS converting the block to `display: flex; flex-direction: row`, snapping elements horizontally. This logic prevents heavy maintenance of sprawling SASS/Media-Query files.

### 29. Security
- SQL logic operates exclusively via `mysql2` execute queries using Prepared Statements (`?`). The DB driver encodes the input as variables logic prior to string injection, making SQL drop table inputs inert payload strings.
- Passwords mathematically hashed scaling at 10 rounds using bcrypt. 
- Backend server protects Origin traffic using heavily configured `cors({ origin: 'http://localhost:5173' })`, restricting API executions stemming from foreign unauthorized domains.

### 30. Testing & Verification
The architecture mandates testing distinct pipeline blocks: API requests testing REST response boundaries using Postman, while UI testing revolves around clicking sequences testing State mapping.

### 31. Production Considerations
Scaling into production environments shifts standard Node execution logic into PM2 (Process Manager), ensuring auto-restarting capabilities if a memory leak occurs. The Vite application compiles the complete logical mapping structure into heavily minified, obfuscated `.js` chunk files (`vite build`), preventing unauthorized code logic cloning whilst dropping file payload sizes significantly optimizing global initial fetch times.
