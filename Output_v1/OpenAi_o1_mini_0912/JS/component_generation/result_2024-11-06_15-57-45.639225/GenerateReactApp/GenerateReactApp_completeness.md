# Evaluation Report

### Step 1: Ensure that the API call to https://swapi.dev/api/people is made using axios.
**Pass**: The API call is made using axios in the `fetchCharacters` function within the `useEffect` hook.
```typescript
const response = await axios.get('https://swapi.dev/api/people/');
```

### Step 2: Make sure the data is fetched initially without any input fields.
**Pass**: The data is fetched initially without any input fields. The `useEffect` hook with an empty dependency array ensures the data is fetched on component mount.
```typescript
useEffect(() => {
  const fetchCharacters = async () => {
    // API call logic
  };
  fetchCharacters();
}, []);
```

### Step 3: Ensure a loader or loading indicator is displayed while data is being fetched.
**Pass**: A loading indicator is displayed while data is being fetched. The `loading` state is used to conditionally render the loader.
```typescript
{loading ? (
  <div className="loader">Loading...</div>
) : (
  <ul>
    {characters.map((character) => (
      <li key={character.url}>{character.name}</li>
    ))}
  </ul>
)}
```

### Step 4: Verify that errors are logged to the console if the API call fails.
**Pass**: Errors are logged to the console if the API call fails, as seen in the `catch` block of the `fetchCharacters` function.
```typescript
catch (error) {
  console.error(error);
}
```

### Step 5: Ensure that the fetched characters are displayed in a list format.
**Pass**: The fetched characters are displayed in a list format. The `characters` state is mapped to a list of `<li>` elements.
```typescript
<ul>
  {characters.map((character) => (
    <li key={character.url}>{character.name}</li>
  ))}
</ul>
```

### Step 6: Make sure each list item has a unique key derived from the character URL.
**Pass**: Each list item has a unique key derived from the character URL.
```typescript
<li key={character.url}>{character.name}</li>
```

---

### Summary
- Total number of steps evaluated: 6
- Number of passed steps: 6
- Number of failed steps: 0