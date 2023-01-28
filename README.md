# irctc-seat-availability-with-crawler

This project is for education/learning purposes only.

Create a file toFromList.js with list of to-from station codes. 
e.g:
export const toFromList = [
    {
        from: "ALI",
        to: "NDLS"
    },
    {
        from: "ASM",
        to: "PNG"
    }
];

This app uses the Elasticmail SMTP server to send emails with details as html tables.

To build the docker image from root of directory:
docker build -t train-app .

To run the docker image:
docker run -e NODE_ENV=test  train-app
