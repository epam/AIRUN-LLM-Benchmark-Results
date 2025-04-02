# Evaluation Report

### Step 1: Ensure that the API call to https://swapi.dev/api/people is made using axios.
**Pass**: The code uses `axios.get('https://swapi.dev/api/people')` to make the API call.

### Step 2: Make sure the data is fetched initially without any input fields.
**Pass**: The data is fetched in the `useEffect` hook which runs on component mount, without any input fields.

### Step 3: Ensure a loader or loading indicator is displayed while data is being fetched.
**Pass**: The code uses a `loading` state to display a loading indicator (`<p>Loading...</p>`) while data is being fetched.

### Step 4: Verify that errors are logged to the console if the API call fails.
**Pass**: The code catches errors in the `try...catch` block and logs them to the console using `console.error("Error fetching data:", error)`.

### Step 5: Ensure that the fetched characters are displayed in a list format.
**Pass**: The fetched characters are displayed in a list format using an unordered list (`<ul>`) and list items (`<li>`).

### Step 6: Make sure each list item has a unique key derived from the character URL.
**Pass**: Each list item has a unique key derived from the character URL (`<li key={person.url}>`).

### Summary
- Total number of steps evaluated: 6
- Number of passed steps: 6
- Number of failed steps: 0