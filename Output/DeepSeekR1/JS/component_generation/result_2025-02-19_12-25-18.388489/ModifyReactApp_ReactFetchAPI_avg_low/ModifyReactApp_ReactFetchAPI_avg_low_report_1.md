Your task is to modify the application on React 18.x, which utilizes the SWAPI open API.
You should add a character search functionality and optimize it efficiently (avoid overloading the Backend with requests).

When performing the task, ensure to follow the instructions below:
- Utilize the following libraries: TypeScript, axios.
- Display a loader while loading.
- Send a request with an empty search on the initial render.
- Optimize the code where possible.
- The generated code should not contain any TODOs.
- Return the codebase without additional comments.

index.tsx
```tsx
import React, {useEffect, useState} from 'react';
import axios from 'axios';

interface Character {
    name: string;
    url: string;
}

const CharacterList: React.FC = () => {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchCharacters = async () => {
            try {
                const response = await axios.get('https://swapi.dev/api/people');
                setCharacters(response.data.results);
            } catch (error) {
                console.error('Failed to fetch characters:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCharacters();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <ul>
            {characters.map((character) => (
                <li key={character.url}>{character.name}</li>
            ))}
        </ul>
    );
};

export default CharacterList;
```

## Run 1:
### Answer:
<think>
Okay, I need to add a search functionality to the existing React component that uses SWAPI. The user wants it optimized to avoid overloading the backend, so I should implement debouncing. Let me think about how to structure this.

First, I'll add a search input field. The input's value will be controlled by a state variable, maybe called 'searchTerm'. When the user types, it updates this state. But making a request on every keystroke would be too many calls. So I'll use a debounce function to delay the request until the user stops typing for a bit.

Wait, React 18's useEffect might handle some of this. Oh right, but I need to cancel previous requests if a new one comes in. Alternatively, using a debounce utility would be better. Let me create a debounce function that wraps the API call.

Also, the initial render should send a request with an empty search. The current useEffect runs once on mount, fetching all characters. But with the search, the useEffect should depend on the debounced search term. Hmm, maybe I need to manage the debounced value separately.

I'll need to use useCallback for the fetch function so that it's memoized and doesn't cause unnecessary re-renders. Wait, the fetch function should take the search term as a parameter. Or maybe have the search term as a state that's used inside the effect.

Let me outline the steps:

1. Add a search input to the JSX.
2. Create a state for searchTerm.
3. Create a debounced version of searchTerm using useEffect and setTimeout.
4. When the debounced searchTerm changes, trigger the API call.
5. Use AbortController to cancel pending requests when a new one is made.
6. Handle loading states correctly, showing the loader when a request is in flight.
7. Ensure that the initial request (empty search) is sent on mount.

Wait, the user mentioned to send a request with empty search on initial render. So the initial useEffect should include the search parameter. But how to structure that.

Let me adjust the fetchCharacters function to accept a search parameter. Then, in the useEffect that triggers based on the debounced search term, call fetchCharacters with that term.

Also, when the component mounts, the debounced search term would be empty, so the initial request is sent. Then, as the user types, the debounced term updates, triggering new requests.

For the debounce, I can create a custom hook or use a useDebounce hook. Alternatively, within the component, use a useEffect that sets a timeout to update a debouncedSearch state. Let's see.

Maybe create a state for debouncedSearch, and in a useEffect that runs when searchTerm changes, set a timeout to update debouncedSearch after a delay, like 500ms. Then, the useEffect that fetches data depends on debouncedSearch.

Yes, that way, when the user types, searchTerm updates immediately, but debouncedSearch only updates after the delay. Then, the API call is triggered by debouncedSearch changing.

Also, need to handle the AbortController to cancel previous requests if a new one is made before the previous completes. So in the fetch function, create a new AbortController each time, and pass the signal to axios. If the component unmounts or the effect is cleaned up, abort the request.

So, in the useEffect for fetching data, the fetchCharacters function should be called with the debouncedSearch term, and use the AbortController.

Let me structure the code:

- Add a state for searchTerm and setSearchTerm.
- Add a state for debouncedSearch, but maybe use a useEffect to update it after a delay.
- Alternatively, use a useDebounce custom hook. But since the user didn't mention adding any new libraries, I should implement debounce manually.

Wait, the user allows using axios and TypeScript, but no other libraries. So I need to implement debounce without external libraries.

So, in the component:

const [searchTerm, setSearchTerm] = useState('');
const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

useEffect(() => {
  const timerId = setTimeout(() => {
    setDebouncedSearchTerm(searchTerm);
  }, 500);

  return () => {
    clearTimeout(timerId);
  };
}, [searchTerm]);

Then, another useEffect that triggers when debouncedSearchTerm changes, which calls the API.

In that useEffect, create an AbortController, and pass the signal to axios.get. Then, in the cleanup function, abort the request.

Also, handle the loading state: when a request starts, set loading to true, and when it finishes (success or error), set loading to false.

Wait, the initial code has a loading state that's set to true when the component mounts, and false after the fetch. But with the search, each new fetch should trigger the loading state again.

So, in the useEffect that fetches data, when debouncedSearchTerm changes, setLoading(true), then after the request completes, setLoading(false).

But need to handle the case where the component might unmount before the request completes, to avoid state updates on unmounted components.

So, putting it all together:

In the useEffect for fetching data:

useEffect(() => {
  const controller = new AbortController();
  const fetchCharacters = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://swapi.dev/api/people', {
        params: { search: debouncedSearchTerm },
        signal: controller.signal
      });
      setCharacters(response.data.results);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled:', error.message);
      } else {
        console.error('Failed to fetch characters:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  fetchCharacters();

  return () => {
    controller.abort();
  };
}, [debouncedSearchTerm]);

This way, whenever debouncedSearchTerm changes, a new request is sent with the search parameter. The AbortController cancels the previous request if a new one is made before the previous finishes.

Also, the initial render will have debouncedSearchTerm as empty (since searchTerm is initialized to empty, and the useEffect sets debouncedSearchTerm to empty after 500ms). Wait, no: when the component mounts, searchTerm is empty, so the useEffect for debouncing runs, sets a timer to update debouncedSearchTerm after 500ms. But initially, debouncedSearchTerm is empty, so the first useEffect (the one that fetches data) will run once on mount, with debouncedSearchTerm as empty. Then, after 500ms, if the user hasn't typed anything, debouncedSearchTerm remains empty, so no new request. Wait, no: when the component mounts, the debouncedSearchTerm is initialized to empty, so the useEffect for fetching data runs once, fetching all characters. Then, the useEffect for debouncing will set debouncedSearchTerm to empty after 500ms, but since it's the same as the initial value, the useEffect for fetching data won't run again. So the initial fetch is correct.

Wait, no. Let's see:

- On initial mount, searchTerm is empty. The useEffect for debouncing runs, sets a timer to setDebouncedSearchTerm to '' after 500ms. But since the initial debouncedSearchTerm is already '', when the timer completes, it doesn't change, so the useEffect for fetching data (which depends on debouncedSearchTerm) doesn't re-run. But the initial useEffect for fetching data runs once when the component mounts, because debouncedSearchTerm is initialized to ''. Wait, no: the useEffect for fetching data is triggered when debouncedSearchTerm changes. But on initial mount, debouncedSearchTerm is '', so the useEffect runs once. Then, after 500ms, the debouncedSearchTerm is set to '' again, but since it's the same value, the useEffect doesn't re-run. So the initial fetch is handled by the useEffect that depends on debouncedSearchTerm. So the initial code's useEffect (which was in the original code) can be replaced by this new setup.

Wait, the original code had a useEffect that ran once on mount, fetching the data. Now, with the new setup, the useEffect that fetches data depends on debouncedSearchTerm. Since debouncedSearchTerm is initialized to '', the useEffect runs on mount, fetching the data. So the initial request is sent correctly. Then, when the user types, after debouncing, debouncedSearchTerm changes, triggering a new request.

So the original useEffect (with empty dependency array) can be removed, and replaced by the new useEffect that depends on debouncedSearchTerm.

So the steps are:

1. Add the search input with onChange updating searchTerm.

2. Implement debouncing for searchTerm to get debouncedSearchTerm.

3. Use debouncedSearchTerm in the useEffect that triggers the API call.

4. Add AbortController to cancel previous requests.

5. Handle loading state correctly.

Now, modifying the code:

In the JSX, add the input:

return (
  <div>
    <input
      type="text"
      placeholder="Search characters..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    {loading ? (
      <div>Loading...</div>
    ) : (
      <ul>
        {characters.map((character) => (
          <li key={character.url}>{character.name}</li>
        ))}
      </ul>
    )}
  </div>
);

Then, the states:

const [searchTerm, setSearchTerm] = useState('');
const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
const [characters, setCharacters] = useState<Character[]>([]);
const [loading, setLoading] = useState<boolean>(true);

Wait, but initially, the loading is true. When the component mounts, the useEffect for debouncedSearchTerm runs, which triggers the fetch, which sets loading to true again. But initially, the loading is already true. So maybe the initial state for loading should be true, and the first fetch will set it to false when done. But when the user starts typing, each new fetch will set loading to true again.

But in the original code, the loading is set to true in the useEffect's fetch function. Now, in the new setup, the useEffect that fetches data when debouncedSearchTerm changes will setLoading(true) at the start of the fetch. So even the initial fetch (on mount) will setLoading(true), but the initial state is already true. So maybe that's redundant, but it's okay. Let me check:

Original code's useEffect runs on mount, sets loading to true (since the initial state is true, but the code in the original's useEffect's fetchCharacters sets loading to true? Wait, no. In the original code, the fetchCharacters is called, and in the finally block, setLoading(false). So the initial state is true, and after the fetch, it's set to false. So the initial code shows the loader until the data is fetched.

In the new code, the useEffect for fetching data runs when debouncedSearchTerm changes, which includes the initial mount. So when the component mounts, debouncedSearchTerm is '', so the useEffect runs, calls fetchCharacters, which sets loading to true. Then, after the fetch, sets loading to false. So the initial state of loading is true, then set to true again (redundantly), but that's okay. It's better to have the loading state managed correctly during each fetch.

So in the new code, the loading state is set to true at the start of each fetch, and false when done. So even if the initial state is true, the first fetch will set it to true again (no harm), and then to false.

But perhaps the initial state for loading should be false? Wait, no. Because when the component first mounts, we want to show the loader until the data is fetched. So the initial state is true. Then, when the useEffect runs (on mount), it starts the fetch, which sets loading to true again (but it's already true), then after the fetch, sets it to false. So the user sees the loader until the data is loaded.

But in the new code, when the component mounts, the useEffect for debouncedSearchTerm (which is '') runs, which triggers the fetch. The fetch function sets loading to true, then proceeds. So the initial render will have loading as true, which shows the loader. Then, when the fetch completes, loading is set to false. So that's correct.

Now, the code for the useEffect that handles debouncing:

useEffect(() => {
  const timerId = setTimeout(() => {
    setDebouncedSearchTerm(searchTerm);
  }, 500);

  return () => {
    clearTimeout(timerId);
  };
}, [searchTerm]);

This will update debouncedSearchTerm 500ms after the user stops typing. Then, the useEffect that fetches data depends on debouncedSearchTerm.

Putting it all together, the modified code would look like this:

In the component:

Add the searchTerm and debouncedSearchTerm states.

Add the useEffect for debouncing.

Modify the existing useEffect to depend on debouncedSearchTerm, and use the search parameter in the API call.

Also, add the AbortController to cancel requests.

Testing edge cases: if the user types quickly, the previous requests should be canceled. The axios call uses the signal from the AbortController, and in the useEffect's cleanup, the controller.abort() is called, which cancels the request.

Also, handle the case where the component unmounts during a fetch, to avoid state updates on an unmounted component.

Now, let me write the code.

First, add the input element.

Then, the states:

const [searchTerm, setSearchTerm] = useState<string>('');
const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
const [characters, setCharacters] = useState<Character[]>([]);
const [loading, setLoading] = useState<boolean>(true);

Then, the useEffect for debouncing:

useEffect(() => {
  const timerId = setTimeout(() => {
    setDebouncedSearchTerm(searchTerm);
  }, 500);

  return () => {
    clearTimeout(timerId);
  };
}, [searchTerm]);

Then, the useEffect for fetching data:

useEffect(() => {
  const controller = new AbortController();
  const fetchCharacters = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://swapi.dev/api/people', {
        params: { search: debouncedSearchTerm },
        signal: controller.signal
      });
      setCharacters(response.data.results);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled:', error.message);
      } else {
        console.error('Failed to fetch characters:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  fetchCharacters();

  return () => {
    controller.abort();
  };
}, [debouncedSearchTerm]);

Then, in the JSX, the input is added, and the loading state is handled.

Wait, but in the original code, the loading is set to true in the useEffect's fetch function. Now, in the new code, the useEffect for fetching data runs when debouncedSearchTerm changes. So each time the debounced term changes, a new fetch is initiated, and loading is set to true at the start of the fetch.

This should handle showing the loader during each search.

Testing this, when the user types, after 500ms, the debounced term updates, triggering the fetch, which sets loading to true, and when the fetch completes, sets it to false.

This should work.

Now, check if the initial render sends a request with empty search. Yes, because on mount, debouncedSearchTerm is initialized to empty string, so the useEffect runs, sending a request with search=''.

So the code meets all the requirements: search functionality with debounce, loader displayed during loading, initial request with empty search, optimized with aborting previous requests, using axios and TypeScript.

Also, the code is optimized by avoiding unnecessary requests and using debounce.

I think that's all. Now, write the code as the answer.
</think>

index.tsx
```tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Character {
    name: string;
    url: string;
}

const CharacterList: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
    const [characters, setCharacters] = useState<Character[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => {
            clearTimeout(timerId);
        };
    }, [searchTerm]);

    useEffect(() => {
        const controller = new AbortController();
        const fetchCharacters = async () => {
            try {
                setLoading(true);
                const response = await axios.get('https://swapi.dev/api/people', {
                    params: { search: debouncedSearchTerm },
                    signal: controller.signal
                });
                setCharacters(response.data.results);
            } catch (error) {
                if (axios.isCancel(error)) {
                    console.log('Request canceled:', error.message);
                } else {
                    console.error('Failed to fetch characters:', error);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCharacters();

        return () => {
            controller.abort();
        };
    }, [debouncedSearchTerm]);

    return (
        <div>
            <input
                type="text"
                placeholder="Search characters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {loading ? (
                <div>Loading...</div>
            ) : (
                <ul>
                    {characters.map((character) => (
                        <li key={character.url}>{character.name}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CharacterList;
```

### Tokens: {'input_tokens': 376, 'output_tokens': 3878}
### Execution time: 90.88324308395386
