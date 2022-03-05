import Head from "next/head";
import { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Label,
  Textbox,
  Button,
  Textarea,
  SecondaryButton,
} from "../components/core";

export default function Home() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [endpoint, setEndpoint] = useState("");
  const [key, setKey] = useState("");
  const [text, setText] = useState("");
  const [output, setOutput] = useState(null);

  const colorMap = {
    GEO: "bg-orange-500",
    ORG: "bg-lime-500",
    LOC: "bg-red-500",
    PER: "bg-blue-500",
    ART: "bg-green-500",
    GPE: "bg-rose-500",
    TIM: "bg-indigo-500",
    NAT: "bg-amber-500",
    EVE: "bg-cyan-500",
  };

  const loadModel = async () => {
    setStatus(
      "🚧 Loading Model into Memory, Please Wait for around 30 seconds..."
    );
    setLoading(true);

    try {
      const raw_response = await fetch(endpoint, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-api-key": key,
        },
        method: "GET",
      });
      const response = await raw_response.json();
      console.log(response);
    } catch (err) {
      console.log(err);
    }

    setStatus("⚡ Model is Ready");
    setLoading(false);
  };

  const predict = async () => {
    setStatus("⏳ The model is performing inference");
    setLoading(true);

    try {
      const raw_response = await fetch(endpoint, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-api-key": key,
        },
        method: "POST",
        body: JSON.stringify(text),
      });
      const response = await raw_response.json();
      console.log(response);
      setOutput(response["body"]["output"]);
    } catch (err) {
      console.log(err);
      alert("Something went wrong! Please try again.");
    }

    setStatus("⚡ Model is Ready");
    setLoading(false);
  };

  return (
    <div>
      <Head>
        <title>Named Entity Recognition</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-4xl mt-4">
            🤖{" "}
            <span className="font-bold text-blue-600">
              Named Entity Recognition
            </span>{" "}
            📜
          </h1>

          <div className="mt-3 text-lg sm:text-xl text-gray-700">
            <a
              target="_blank"
              rel="noreferrer"
              href="https://docs.cellstrathub.com/HubAPI%20Deployment%20%F0%9F%9A%80/quickstart"
              className="text-blue-600 hover:text-purple-600 transition ease-in-out duration-200"
            >
              Powered by CellStrat Hub API⚡
            </a>{" "}
          </div>
        </div>

        <Paper>
          <Label emoji="📡">Endpoint</Label>
          <div className="w-full p-2 border rounded-md text-gray-700 focus:outline-none focus:border-blue-600 mb-3">
            https://api.cellstrathub.com/
            <input
              className="border-none focus:outline-none w-2/3"
              placeholder="username/api-name"
              onChange={(e) => {
                setEndpoint("https://api.cellstrathub.com/" + e.target.value);
              }}
            />
          </div>

          <Label emoji="🔑">API Key</Label>
          <Textbox
            id="key"
            type="password"
            placeholder="Enter your Hub API Key"
            onChange={(e) => {
              setKey(e.target.value);
            }}
          />
          <div className="flex float-right">
            <SecondaryButton
              color="gray"
              disabled={loading}
              onClick={async () => {
                await loadModel();
              }}
            >
              Load Model
            </SecondaryButton>
          </div>

          <Label>Text📜</Label>
          <Textarea
            id="context"
            placeholder="Enter the text to extract the entities"
            onChange={(e) => {
              setText(e.target.value);
            }}
          />

          <div className="flex justify-between items-start flex-wrap">
            <p>
              <span className="font-semibold text-gray-700">Status:</span>{" "}
              {status}
            </p>
            <div className="flex items-center justify-center mt-2 gap-2">
              <Button
                className="w-full"
                disabled={loading}
                onClick={async () => {
                  await predict();
                }}
              >
                Predict Answer 🔮
              </Button>
            </div>
          </div>
        </Paper>

        <Paper>
          <Label>Predictions📊</Label>
          <div className="mt-2 text-md flex flex-wrap gap-1.5">
            {output &&
              output.map((item, idx) => {
                let token = item[0];
                let label = item[1];

                if (label === "O") {
                  return (
                    <div key={idx} className="mb-4">
                      {token}
                    </div>
                  );
                } else {
                  return (
                    <div key={idx} className="mb-4">
                      <span
                        key={idx}
                        className={
                          "p-1.5 rounded-md text-white " + colorMap[label]
                        }
                      >
                        {token}
                        <span
                          key={idx}
                          className="bg-white p-0.5 ml-1 rounded-sm text-gray-800 text-sm font-medium"
                        >
                          {label}
                        </span>
                      </span>
                    </div>
                  );
                }
              })}
          </div>
        </Paper>
      </Container>
    </div>
  );
}
