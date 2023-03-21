<h1> 💸 Live Crypto Coin Tracker</h1>

- [Previews](#previews)
  - [Concept](#concept)
  - [During Live Interview](#during-live-interview)
  - [Final touchups post-interview](#final-touchups-post-interview)
- [How to run in development](#how-to-run-in-development)
- [Additional Notes](#additional-notes)

### Previews

#### Concept
<img width="630" alt="image" src="https://user-images.githubusercontent.com/25883629/226639212-b7f45a88-9c3c-49e6-8adb-736a5fbb8d76.png">

#### During Live Interview
<img width="793" alt="SCR-20230321-jpqd" src="https://user-images.githubusercontent.com/25883629/226638892-ed0c8431-a4ac-424d-8e83-d4be18454580.png">

#### Final touchups post-interview
<img width="927" alt="SCR-20230321-jprw" src="https://user-images.githubusercontent.com/25883629/226638984-5e60aa4f-59fa-4d51-96f6-73cd136b7e42.png">

### How to run in development
1. Clone the repo (`git clone https://github.com/nayemalam/live-coin-tracker.git`)
2. cd into the directory (`cd live-coin-tracker`)
3. run `npm install`
4. run `npm run dev`

should be running on http://localhost:5173

### Additional Notes
- I used the [CoinGecko API](https://www.coingecko.com/en/api) to get the symbol image
- I would have added a select dropdown to select the ticker symbol (but ran out of time) 
- On first load, user can expect to see ETH by default
- Would be nice to cache the API response to reduce the number of requests within a given time period (1 minute for example)
- Would be nice to save the selected ticker symbol in local storage so that it persists across page refreshes, this way the user can select which token to load by default