/*
 * Copyright 2024 RSC-Labs, https://rsoftcon.com/
 *
 * MIT License
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "@medusajs/ui";
import { PackingSlipResult } from "../../types/api";
import { Grid } from "@mui/material";

const PackingSlipNumber = ({
  orderId,
  packingSlipNumber,
}: {
  orderId: string;
  packingSlipNumber?: string;
}) => {
  const [data, setData] = useState<any | undefined>(undefined);

  const [error, setError] = useState<any>(undefined);

  const [isHovered, setIsHovered] = useState(false);

  const [isLoading, setLoading] = useState(true);

  const handleClick = async () => {
    toast.loading("Packing slip", {
      description: "Preparing packing slip...",
      duration: Infinity,
    });
    const result: URLSearchParams = new URLSearchParams({
      includeBuffer: "true",
      orderId: orderId,
    });

    fetch(`/admin/documents/packing-slip?${result.toString()}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((result) => {
        if (result && result.buffer) {
          toast.dismiss();
          openPdf(result);
        } else {
          toast.dismiss();
          toast.error("Packing slip", {
            description: "Problem happened when preparing packing slip",
          });
        }
      })
      .catch((error) => {
        setError(error);
        console.error(error);
        toast.dismiss();
        toast.error("Packing slip", {
          description: error,
        });
      });
  };

  const openPdf = (packingSlipResult?: PackingSlipResult) => {
    if (packingSlipResult && packingSlipResult.buffer) {
      const anyBuffer = packingSlipResult.buffer as any;
      const blob = new Blob([new Uint8Array(anyBuffer.data)], {
        type: "application/pdf",
      });
      const pdfURL = URL.createObjectURL(blob);
      window.open(pdfURL, "_blank");
    }
  };

  const result: URLSearchParams = new URLSearchParams({
    orderId: orderId,
  });

  useEffect(() => {
    setLoading(true);
  }, [packingSlipNumber, orderId]);

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    fetch(`/admin/documents/packing-slip?${result.toString()}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        console.error(error);
      });
  }, [isLoading]);

  if (isLoading) {
    return <CircularProgress size={8} />;
  }

  if (data && data.packingSlip) {
    return (
      <Grid item>
        <p
          className="text-grey-90 hover:text-violet-60 cursor-pointer pl-2 transition-colors duration-200"
          onClick={() => handleClick()}
          style={{
            cursor: "pointer",
            color: isHovered ? "violet" : "grey",
            textDecoration: isHovered ? "underline" : "none",
            transition: "color 0.2s, text-decoration 0.2s",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {`Packing slip: ${data.packingSlip.displayNumber}`}
        </p>
      </Grid>
    );
  } else {
    return <></>;
  }
};

export default PackingSlipNumber;
