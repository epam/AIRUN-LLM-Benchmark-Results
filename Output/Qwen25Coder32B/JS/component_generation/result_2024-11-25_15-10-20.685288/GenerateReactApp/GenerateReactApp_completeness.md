# Evaluation Report

### Step 1: Ensure that the API call to https://swapi.dev/api/people is made using axios.
**Pass**: The code uses `axios.get` to make the API call to `https://swapi.dev/api/people`.

### Step 2: Make sure the data is fetched initially without any input fields.
**Pass**: The data is fetched in the `useEffect` hook which runs on component mount, without any input fields.

### Step 3: Ensure a loader or loading indicator is displayed while data is being fetched.
**Pass**: The code checks the `loading` state and displays "Loading..." while data is being fetched.

### Step 4: Verify that errors are logged to the console if the API call fails.
**Pass**: The code catches errors in the `try...catch` block and logs them to the console with `console.error`.

### Step 5: Ensure that the fetched characters are displayed in a list format.
**Pass**: The fetched characters are displayed in an unordered list (`<ul>`) with each character in a list item (`<li>`).

### Step 6: Make sure each list item has a unique key derived from the character URL.
**Pass**: Each list item has a unique key derived from the character's URL.

---

**Total Steps Evaluated**: 6  
**Number of Passed Steps**: 6  
**Number of Failed Steps**: 0