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

import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { Grid } from "@mui/material";
import { toast } from "@medusajs/ui";
import { InvoiceResult } from "../../types/api";

const InvoiceNumberFromOrder = ({
  orderId,
  invoiceNumber,
}: {
  orderId: string;
  invoiceNumber?: string;
}) => {
  const [data, setData] = useState<any | undefined>(undefined);

  const [error, setError] = useState<any>(undefined);

  const [isHovered, setIsHovered] = useState(false);

  const [isLoading, setLoading] = useState(true);

  const handleClick = async () => {
    toast.loading("Invoice", {
      description: "Preparing invoice...",
      duration: Infinity,
    });
    const result: URLSearchParams = new URLSearchParams({
      includeBuffer: "true",
      orderId: orderId,
    });

    fetch(`/admin/documents/invoice?${result.toString()}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((result) => {
        if (result && result.buffer) {
          toast.dismiss();
          openPdf(result);
        } else {
          toast.dismiss();
          toast.error("Invoice", {
            description: "Problem happened when preparing invoice",
          });
        }
      })
      .catch((error) => {
        setError(error);
        console.error(error);
        toast.dismiss();
        toast.error("Invoice", {
          description: error,
        });
      });
  };

  const openPdf = (invoiceResult?: InvoiceResult) => {
    if (invoiceResult && invoiceResult.buffer) {
      const anyBuffer = invoiceResult.buffer as any;
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
  }, [invoiceNumber, orderId]);

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    fetch(`/admin/documents/invoice?${result.toString()}`, {
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
    return (
      <Grid item>
        <CircularProgress size={8} />
      </Grid>
    );
  }

  if (data && data.invoice) {
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
          {`Invoice: ${data.invoice.displayNumber}`}
        </p>
      </Grid>
    );
  } else {
    return <></>;
  }
};

export default InvoiceNumberFromOrder;
