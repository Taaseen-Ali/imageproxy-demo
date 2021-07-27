import { useState } from "react";
import {
  proxyFetch,
  report as imgReport,
  ImageProxyServer,
  ImageProxyDataType,
  ModerationLabel,
} from "nft-image-proxy";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Fetcher = () => {
  const server: ImageProxyServer = {
    url: "https://imgproxy-prod.cryptonomic-infra.tech",
    apikey: "pdaIFkzVAUOV2UKk2Xt9N4XAUxEOxPGFVOghjkRibZrNl0KhIiC4D7LVE22uqAXf",
    version: "1.0.0",
  };
  const [url, setUrl] = useState<string | undefined>();
  const [img, setImg] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [showReport, setShowReport] = useState(false);
  const [report, setReport] = useState<string | undefined>();

  const submitReport = async () => {
    if (url && report) {
      imgReport(server, url, [
        ModerationLabel[report as keyof typeof ModerationLabel],
      ]).then((d) => console.log(d));
    }
  };

  const handleSubmit = async () => {
    console.log(url);
    setError(undefined);
    setImg(undefined);
    if (url) {
      proxyFetch(server, url, ImageProxyDataType.Json, false).then((d: any) => {
        console.log(d);
        if (d.rpc_status === "Ok") {
          if (d.result.moderation_status === "Allowed") {
            setImg(d.result.data);
          }
          if (d.result.moderation_status === "Blocked") {
            let labelString = "";
            d.result.categories.forEach((elem: string, i: number) => {
              labelString = i === 0 ? elem : labelString + ", " + elem;
            });

            setError(
              `Image was blocked because of it contains the following labels: ${labelString}`
            );
          }
        }
        if (d.rpc_status === "Err") {
          setError(`Encountered Error: ${d.error.reason}`);
        }
      });
    }
  };
  return (
    <div className="flex flex-col align-middle w-1/3 mx-auto my-8 space-y-4 h-full">
      <div className="flex flex-col justify-center relative h-2/3 border-gray border-2 bg-gray-100">
        {!error ? (
          <img className="object-contain w-full h-full" src={img} alt="" />
        ) : (
          <FontAwesomeIcon className="mx-auto" icon={faEyeSlash} size="4x" />
        )}
        {img && !error && url && (
          <button
            onClick={() => setShowReport(true)}
            disabled={showReport}
            className="bg-blue-500 m-2 p-2 rounded-xl opacity-50 hover:opacity-100 absolute top-0 right-0 text-center"
          >
            {showReport ? (
              <button onClick={() => setShowReport(false)}>X</button>
            ) : (
              "Report Image"
            )}

            {showReport && (
              <div className="inline">
                <input
                  className="p-2 rounded-xl ml-2"
                  placeholder="Suggested Moderation Label"
                  onChange={(e) => setReport(e.target.value)}
                />
                <button
                  onClick={submitReport}
                  className="bg-blue-300 p-2 rounded-xl ml-2"
                >
                  Done
                </button>
              </div>
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-center font-semibold">{error}</p>
      )}
      <input
        type="text"
        className="border-black border-2 rounded-xl p-2"
        placeholder="image link"
        onChange={(e) => setUrl(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className="border-black border-2 rounded-xl p-2 bg-blue-500"
      >
        Fetch
      </button>
    </div>
  );
};

export default Fetcher;
