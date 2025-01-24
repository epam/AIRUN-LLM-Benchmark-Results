# Evaluation Report

### Step 1: Ensure that the API call to https://swapi.dev/api/people is made using axios.
- **Pass**: The API call is made using axios in the `useEffect` hook.
  ```tsx
  useEffect(() => {
    axios.get('https://swapi.dev/api/people')
      .then(response => {
        setCharacters(response.data.results);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);
  ```

### Step 2: Make sure the data is fetched initially without any input fields.
- **Pass**: The data is fetched initially without any input fields. The `useEffect` hook with an empty dependency array ensures the data is fetched on component mount.

### Step 3: Ensure a loader or loading indicator is displayed while data is being fetched.
- **Pass**: A loading indicator is displayed while data is being fetched.
  ```tsx
  if (loading) {
    return <p>Loading...</p>;
  }
  ```

### Step 4: Verify that errors are logged to the console if the API call fails.
- **Fail**: Errors are not logged to the console if the API call fails. The catch block only sets the loading state to false.
  ```tsx
  .catch(() => {
    setLoading(false);
  });
  ```

### Step 5: Ensure that the fetched characters are displayed in a list format.
- **Pass**: The fetched characters are displayed in a list format.
  ```tsx
  return (
    <ul>
      {characters.map(character => (
        <li key={character.url}>{character.name}</li>
      ))}
    </ul>
  );
  ```

### Step 6: Make sure each list item has a unique key derived from the character URL.
- **Pass**: Each list item has a unique key derived from the character URL.
  ```tsx
  {characters.map(character => (
    <li key={character.url}>{character.name}</li>
  ))}
  ```

---

### Summary
- **Total number of steps evaluated**: 6
- **Number of passed steps**: 5
- **Number of failed steps**: 1