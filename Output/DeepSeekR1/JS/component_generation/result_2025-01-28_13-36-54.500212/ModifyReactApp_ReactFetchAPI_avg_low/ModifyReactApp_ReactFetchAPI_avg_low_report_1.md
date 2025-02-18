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
Okay, I need to add a character search functionality to the existing React component. The user wants it optimized to avoid overloading the backend, so I should implement debouncing. Let me think about how to structure this.

First, I'll add a search input field. The input's value will be controlled by a state variable, maybe called 'searchTerm'. Then, when the user types, it updates this state. But making a request on every keystroke would be too many calls. So I need to debounce the API requests.

I remember that using a useEffect hook with a setTimeout and clearTimeout can handle debouncing. The useEffect would depend on searchTerm, and inside, set a timeout to trigger the fetch after a delay, say 500ms. Also, if the searchTerm is empty, it should still fetch all characters as per the initial render requirement.

Wait, the user mentioned sending an empty search on initial render. The current useEffect runs once on mount with empty deps. But when adding the search, I need to make sure that the initial fetch still happens. Maybe the useEffect should depend on the searchTerm, and the initial render will have searchTerm as empty, so it fetches all characters. That makes sense.

So, I'll create a state for searchTerm. Then, in the useEffect, whenever searchTerm changes, it triggers the debounced fetch. Also, the axios GET request should include the search parameter. The SWAPI API uses 'search' query param, so the URL would be `https://swapi.dev/api/people?search=${searchTerm}`. But when searchTerm is empty, it should just be 'https://swapi.dev/api/people' without the param, or maybe include it with an empty string which the API ignores. Either way works.

Next, the fetchCharacters function needs to accept the search term. Let me adjust the useEffect to include searchTerm in the dependency array. But to prevent immediate requests on every keystroke, I'll wrap the fetch in a setTimeout and clear it on cleanup. That's the debounce part.

Wait, the useEffect will run every time searchTerm changes. So inside the useEffect, set up a timer that calls fetchCharacters after a delay. Then, the cleanup function clears the timer. That way, if the user types quickly, each keystroke cancels the previous timer, so only the last one executes after the delay.

Also, the initial render should send a request with empty search. Since the searchTerm is initialized to an empty string, the useEffect will run once on mount, setting the timer. After 500ms, it fetches all characters. But wait, the initial useEffect in the original code runs on mount and fetches all characters. If I change the useEffect to depend on searchTerm, then on mount, it would trigger the debounced fetch. But the user wants the initial render to send the empty search request immediately. Hmm, maybe the initial fetch shouldn't be debounced. Or maybe the debounce delay is zero on initial load?

Wait, the user's instruction says: "Send a request with an empty search on the initial render." So when the component first loads, it should fetch all characters without waiting for the debounce. But subsequent searches should be debounced. How to handle that?

Hmm, perhaps the initial fetch is handled separately. But that might complicate things. Alternatively, set the debounce timeout to 0 when the component mounts. Wait, maybe not. Let me think.

Alternatively, the useEffect for fetching data will run whenever searchTerm changes. On initial render, searchTerm is empty, so the useEffect runs. The debounce timer is set. But for the initial load, we don't want to wait 500ms. So maybe the initial fetch should happen immediately, and subsequent changes to searchTerm are debounced.

Wait, that's a problem. Because the initial render's useEffect would have searchTerm as empty string, and the timer would wait 500ms before fetching. But the user wants the initial request to be sent immediately. So how to differentiate between the initial load and subsequent changes?

Ah, perhaps the initial fetch is done in a separate useEffect with an empty dependency array, and the search functionality is handled in another useEffect that's debounced. But that might lead to duplicate code.

Alternatively, check if it's the initial render. For example, using a ref to track if it's the first time. Let's see:

We can have a isInitialMount ref set to true. In the useEffect, if it's the initial mount, we fetch immediately without debounce. Otherwise, we apply the debounce. Then, after the first run, set isInitialMount to false.

That could work. Let's structure that.

So, inside the useEffect for fetching data (which depends on searchTerm), we check if it's the initial mount. If yes, fetch immediately. Otherwise, set a timeout. But how to track the initial mount? Using a ref.

So, add a useRef called isInitialMount, initialized to true. In the useEffect, if isInitialMount.current is true, then call fetchCharacters immediately, and set isInitialMount to false. Otherwise, set up the debounce.

Wait, but the useEffect's dependencies include searchTerm. So on initial mount, searchTerm is empty, and the useEffect runs. Then, when the user types, searchTerm changes, and the useEffect runs again, but isInitialMount is already false, so it uses the debounce.

Yes, that could work. Let's outline the steps:

1. Add a state for searchTerm:
   const [searchTerm, setSearchTerm] = useState<string>('');

2. Add an input element in the JSX that updates searchTerm on change.

3. Create a useEffect that depends on searchTerm.

4. Inside this useEffect, check if it's the initial mount using a ref. If yes, fetch data immediately. Otherwise, set a timeout to fetch after a delay.

5. The fetch function should use the current searchTerm to make the API call.

6. Also, handle the cleanup of the timeout in the useEffect's cleanup function.

Additionally, the loader should display when loading, so the loading state is set to true when a fetch starts, and false when it completes.

Wait, but in the original code, the loading is set to true when the component mounts, and then false after the initial fetch. With the new setup, whenever a fetch is initiated (either from initial load or search), the loading should be set to true. So, in the fetchCharacters function, setLoading(true) before the try block.

But need to make sure that concurrent requests don't interfere. For example, if a user types quickly, multiple requests may be in flight. Using axios's CancelToken could help cancel previous requests. The user mentioned optimizing to avoid overloading the backend, so debouncing and canceling previous requests are both important.

So, perhaps implement both debouncing and request cancellation.

Let me adjust the fetch function to use a cancel token. Each time a new request is made, cancel the previous one if it's still pending.

In the useEffect, when setting up the fetch, create a cancel token source. Then, in the cleanup function of the useEffect, cancel the request.

Wait, but with the debounce, the useEffect's cleanup would run when the dependencies change or the component unmounts. So, for each timeout, we need to cancel the previous timeout and the previous request.

This is getting a bit complex. Let's structure it step by step.

First, the states:

- characters: the list to display.
- loading: boolean to show loader.
- searchTerm: string for the input.

Then, the useEffect for fetching data.

Inside the useEffect, we have a variable to track if the component is still mounted (to avoid state updates on unmounted components), but with React 18's strict mode, maybe that's not necessary. Alternatively, use the abort controller with axios.

So, here's the plan:

1. Add the search input in the JSX.

2. Add the searchTerm state.

3. Create a useEffect that triggers the fetch when searchTerm changes, with debounce and cancellation.

4. Use a debounce function (either a custom hook or a setTimeout/clearTimeout approach).

5. Use axios's cancel token to cancel previous requests when a new one is made.

Let me try to code this.

First, in the component:

Add the input element:

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

Then, the useEffect for fetching data.

But the original useEffect runs on mount. Now, we need to have it run whenever searchTerm changes, but debounced.

So, the useEffect will be:

useEffect(() => {
    const fetchCharacters = async (search: string) => {
        setLoading(true);
        try {
            const response = await axios.get(`https://swapi.dev/api/people`, {
                params: { search },
                cancelToken: new axios.CancelToken((c) => (cancel = c)),
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

    let cancel: axios.Canceler;
    const handler = setTimeout(() => {
        fetchCharacters(searchTerm);
    }, 500);

    return () => {
        clearTimeout(handler);
        if (cancel) {
            cancel('Canceled due to new request');
        }
    };
}, [searchTerm]);

Wait, but in this setup, every time searchTerm changes, the useEffect runs, sets a timeout to call fetchCharacters after 500ms. If the user types again before 500ms, the previous timeout is cleared (via the cleanup function), and a new one is set. This is the debounce.

Also, using axios's cancel token to cancel the previous request if a new one is made. So, each time the handler runs, it creates a new cancel token. The cleanup function will cancel the previous request if it's still pending.

But in the code above, the 'cancel' variable is declared inside the useEffect. Each time, the handler is a new setTimeout. The cleanup function will clear the timeout and call cancel if it exists.

This should handle both debouncing and request cancellation.

But wait, the initial render: when the component mounts, searchTerm is empty, so the useEffect runs. The handler is set to 500ms. But the user wants the initial request to be sent immediately. So this approach would wait 500ms even on initial load, which is not desired.

Ah, right. The user's instruction says: "Send a request with an empty search on the initial render." So the initial request should happen immediately, not after a debounce. But subsequent searches should be debounced.

So how to handle that?

Hmm. So the initial fetch (empty search) should be done without debounce, but when the user starts typing, the debounce applies.

So, perhaps the initial fetch is done in a separate useEffect with empty dependency array, and the search functionality is handled in another useEffect that's debounced.

But that would split the fetching logic into two places, which might not be ideal. Alternatively, adjust the debounce logic to have 0 delay on the initial render.

Wait, maybe use a ref to track whether it's the initial load. Let's try that.

Add a isInitialMount ref:

const isInitialMount = useRef(true);

useEffect(() => {
    if (isInitialMount.current) {
        isInitialMount.current = false;
        // Fetch immediately without debounce
        fetchCharacters(searchTerm);
    } else {
        // Apply debounce
        const handler = setTimeout(() => {
            fetchCharacters(searchTerm);
        }, 500);

        return () => {
            clearTimeout(handler);
            if (cancel) {
                cancel('Canceled due to new request');
            }
        };
    }
}, [searchTerm]);

But how to structure this inside the useEffect. Wait, perhaps:

Inside the useEffect, check if it's the initial mount. If yes, fetch immediately. Otherwise, set the timeout.

But the problem is that the initial mount's useEffect would run once, and then when the user types, the useEffect runs again. But the isInitialMount ref is set to false after the first run.

But how to handle the cleanup function in the initial case. Because if we fetch immediately, there's no timeout to clear. So the cleanup function would only apply when the useEffect runs again (i.e., when the user types).

Wait, perhaps the code can be structured as follows:

useEffect(() => {
    let cancel: axios.Canceler;
    const fetchCharacters = async (search: string) => {
        setLoading(true);
        try {
            const response = await axios.get(`https://swapi.dev/api/people`, {
                params: { search },
                cancelToken: new axios.CancelToken((c) => (cancel = c)),
            });
            setCharacters(response.data.results);
        } catch (error) {
            if (!axios.isCancel(error)) {
                console.error('Failed to fetch characters:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    if (isInitialMount.current) {
        fetchCharacters(searchTerm);
        isInitialMount.current = false;
    } else {
        const handler = setTimeout(() => {
            fetchCharacters(searchTerm);
        }, 500);

        return () => {
            clearTimeout(handler);
            if (cancel) {
                cancel('Canceled due to new request');
            }
        };
    }
}, [searchTerm]);

But wait, the initial fetch would not have a cleanup function, because the else clause is where the cleanup is returned. So in the initial run, the useEffect doesn't return a cleanup function. Then, when the user types, the useEffect runs again, and the cleanup is for the previous effect (which was the initial run). But the initial run didn't have a handler or cancel token. Hmm, maybe that's okay.

Wait, in the initial run, the code calls fetchCharacters immediately. The axios request is made, and the cancel token is created. But the useEffect's cleanup function is only returned in the else clause. So when the component unmounts during the initial fetch, there's no cleanup to cancel the request. That could lead to a memory leak or state updates on an unmounted component.

So, perhaps the initial fetch also needs to have a way to cancel the request if the component unmounts before it completes.

Therefore, the code should handle cleanup for both cases.

Alternative approach: Always set up the cancel token, regardless of whether it's the initial fetch or a debounced one.

Let me restructure the code:

useEffect(() => {
    let cancel: axios.Canceler;
    const controller = new AbortController();

    const fetchCharacters = async (search: string) => {
        setLoading(true);
        try {
            const response = await axios.get(`https://swapi.dev/api/people`, {
                params: { search },
                cancelToken: new axios.CancelToken((c) => (cancel = c)),
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

    let handler: NodeJS.Timeout;
    if (isInitialMount.current) {
        fetchCharacters(searchTerm);
        isInitialMount.current = false;
    } else {
        handler = setTimeout(() => {
            fetchCharacters(searchTerm);
        }, 500);
    }

    return () => {
        if (handler) {
            clearTimeout(handler);
        }
        if (cancel) {
            cancel('Canceled due to new request');
        }
    };
}, [searchTerm]);

This way, whether it's the initial fetch or a debounced one, the cleanup function will cancel any pending request.

But in the initial case, there's no handler (since it's called immediately), so the cleanup function will only check for the cancel token. If the component unmounts before the initial fetch completes, the cancel token will cancel the request.

This should handle both cases.

So, the isInitialMount ref is used to trigger the initial fetch immediately, and subsequent changes are debounced.

This approach should satisfy the requirement of sending the initial request immediately and debouncing subsequent searches.

Now, putting it all together.

The code will have:

- The input for searchTerm.

- The useEffect with the logic above.

- Handling loading states.

Testing this, when the component first mounts, it sends the request immediately. When the user types, it waits 500ms after the last keystroke before sending the request. Also, if a request is pending and a new one is triggered, the previous one is canceled.

This should optimize the number of requests sent to the backend.

Now, let's code this step by step.

First, add the searchTerm state:

const [searchTerm, setSearchTerm] = useState<string>('');

Add the input element in the JSX:

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

Then, the useEffect with the isInitialMount ref:

const isInitialMount = useRef(true);

useEffect(() => {
    let cancel: axios.Canceler;
    let handler: NodeJS.Timeout;

    const fetchCharacters = async (search: string) => {
        setLoading(true);
        try {
            const response = await axios.get('https://swapi.dev/api/people', {
                params: { search },
                cancelToken: new axios.CancelToken((c) => (cancel = c)),
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

    if (isInitialMount.current) {
        fetchCharacters(searchTerm);
        isInitialMount.current = false;
    } else {
        handler = setTimeout(() => {
            fetchCharacters(searchTerm);
        }, 500);
    }

    return () => {
        if (handler) {
            clearTimeout(handler);
        }
        if (cancel) {
            cancel('Canceled due to new request');
        }
    };
}, [searchTerm]);

This should handle the initial fetch and debounced searches.

Now, check for possible issues.

- The initial fetch is done without a timeout, so it's immediate.

- Subsequent changes to searchTerm trigger a 500ms debounce.

- Each new request cancels the previous one, whether it's from a timeout or an in-flight request.

- The loading state is set to true whenever a fetch starts, and false when it completes or errors.

This should meet all the requirements: search functionality, debouncing, initial empty search, loading state, and optimized requests.

Now, let's write the final code incorporating these changes.
</think>

index.tsx
```tsx
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

interface Character {
    name: string;
    url: string;
}

const CharacterList: React.FC = () => {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const isInitialMount = useRef(true);

    useEffect(() => {
        let cancel: axios.Canceler;
        let handler: NodeJS.Timeout;

        const fetchCharacters = async (search: string) => {
            setLoading(true);
            try {
                const response = await axios.get('https://swapi.dev/api/people', {
                    params: { search },
                    cancelToken: new axios.CancelToken((c) => (cancel = c)),
                });
                setCharacters(response.data.results);
            } catch (error) {
                if (!axios.isCancel(error)) {
                    console.error('Failed to fetch characters:', error);
                }
            } finally {
                setLoading(false);
            }
        };

        if (isInitialMount.current) {
            fetchCharacters(searchTerm);
            isInitialMount.current = false;
        } else {
            handler = setTimeout(() => {
                fetchCharacters(searchTerm);
            }, 500);
        }

        return () => {
            if (handler) {
                clearTimeout(handler);
            }
            if (cancel) {
                cancel('Canceled due to new request');
            }
        };
    }, [searchTerm]);

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

### Tokens: {'input_tokens': 376, 'output_tokens': 4620}
### Execution time: 274.8293981552124
