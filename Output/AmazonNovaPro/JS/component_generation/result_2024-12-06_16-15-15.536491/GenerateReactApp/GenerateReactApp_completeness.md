# Evaluation Report

### Step 1: Ensure that the API call to https://swapi.dev/api/people is made using axios.
**Pass**: The API call is made using axios in the `fetchCharacters` function.
```typescript
const response = await axios.get<any>('https://swapi.dev/api/people');
```

### Step 2: Make sure the data is fetched initially without any input fields.
**Pass**: The data is fetched in the `useEffect` hook which runs on component mount, without any input fields.
```typescript
useEffect(() => {
  const fetchCharacters = async () => {
    // API call
  };

  fetchCharacters();
}, []);
```

### Step 3: Ensure a loader or loading indicator is displayed while data is being fetched.
**Pass**: A loading indicator is displayed while data is being fetched.
```typescript
return (
  <div className="App">
    {loading ? (
      <div>Loading...</div>
    ) : (
      <ul>
        {characters.map((character, index) => (
          <li key={index}>{character.name}</li>
        ))}
      </ul>
    )}
  </div>
);
```

### Step 4: Verify that errors are logged to the console if the API call fails.
**Pass**: Errors are logged to the console if the API call fails.
```typescript
catch (error) {
  console.error("Error fetching characters:", error);
}
```

### Step 5: Ensure that the fetched characters are displayed in a list format.
**Pass**: The fetched characters are displayed in a list format.
```typescript
<ul>
  {characters.map((character, index) => (
    <li key={index}>{character.name}</li>
  ))}
</ul>
```

### Step 6: Make sure each list item has a unique key derived from the character URL.
**Fail**: The key for each list item is derived from the index, not the character URL.
```typescript
{characters.map((character, index) => (
  <li key={index}>{character.name}</li>
))}
```
The key should be derived from the character URL to ensure uniqueness:
```typescript
{characters.map((character) => (
  <li key={character.url}>{character.name}</li>
))}
```

---

### Summary
- **Total Steps Evaluated**: 6
- **Number of Passed Steps**: 5
- **Number of Failed Steps**: 1