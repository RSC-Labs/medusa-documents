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

import { Alert } from "@medusajs/ui"
import { Container, Heading, RadioGroup, Label, Button, toast } from "@medusajs/ui"
import { useEffect, useState } from 'react'
import { Grid, CircularProgress } from "@mui/material";
import { PackingSlipTemplateKind } from "../../types/template-kind";

const ViewExample = ({kind} : {kind: PackingSlipTemplateKind}) => {
  const [data, setData] = useState<any | undefined>(undefined)

  const [error, setError] = useState<any>(undefined);

  const [isLoading, setLoading] = useState(true);

  const [lastKind, setLastKind] = useState(kind);

  useEffect(() => {
    if (lastKind !== kind) {
      setLastKind(kind);
      if (!isLoading) {
        setLoading(true);
      }
    }
  }, [kind])

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    const result: URLSearchParams = new URLSearchParams({
      template: kind
    })

    fetch(`/admin/documents/packing-slip/preview?${result.toString()}`, {
      credentials: "include",
    })
    .then((res) => res.json())
    .then((result) => {
      if (result && result.message) {
        setError({
          message: result.message
        });
      } else {
        toast.dismiss();
        setData(result)
      }
      setLoading(false)
    })
    .catch((error) => {
      setError(error);
      console.error(error);
    }) 
  }, [isLoading])
  if (isLoading) {
    return (
      <Grid container justifyContent={'center'}>
        <Grid item>
          <CircularProgress size={12}/>
        </Grid>
      </Grid>
    )
  }
  if (error) {
    const trueError = error as any;
    if (trueError.response?.data?.message || trueError.message) {
      if (trueError.message) {
        return (
          <Alert variant="error">{trueError.message}</Alert>
        )
      }
      return (
        <Alert variant="error">{trueError.response.data.message}</Alert>
      )
    } else {
      return (
        <Alert variant="error">Preview can't be generated</Alert>
      )
    }
  }
  if (data && data.buffer) {
    const anyBuffer = data.buffer as any;
    const blob = new Blob([ new Uint8Array(anyBuffer.data)  ], { type : 'application/pdf'});
    const pdfURL = URL.createObjectURL(blob);
    return (
      <iframe src={pdfURL} width={660} height={1000}></iframe>
    )
  } else {
    return (
      <Alert variant="error">Preview can't be generated</Alert>
    );
  }
}

type ChooseTemplateProps = {
  lastKind: PackingSlipTemplateKind,
  setKind: (kind: PackingSlipTemplateKind) => void
}

const ChooseTemplate = (props: ChooseTemplateProps) => {

  const handleChange = (checked: string) => {
    props.setKind(checked as PackingSlipTemplateKind)
  };

  return (
    <RadioGroup onValueChange={handleChange} defaultValue={props.lastKind.toString()}>
      <div className="flex items-center gap-x-3">
        <RadioGroup.Item value={PackingSlipTemplateKind.BASIC.toString()} id={PackingSlipTemplateKind.BASIC.toString()} />
        <Label htmlFor="radio_1" weight="plus">
          Basic
        </Label>
      </div>
      <div className="flex items-center gap-x-3">
        <RadioGroup.Item value={PackingSlipTemplateKind.BASIC_SMALL.toString()} id={PackingSlipTemplateKind.BASIC_SMALL.toString()} />
        <Label htmlFor="radio_1" weight="plus">
          Basic A7
        </Label>
      </div>
    </RadioGroup>
  )
}

type AdminPackingSlipTemplatePostReq = {
  packingSlipTemplate: PackingSlipTemplateKind
}

const TemplatesTabContent = ({lastKind} : {lastKind?: PackingSlipTemplateKind}) => {
  const [templateKind, setTemplateKind] = useState<PackingSlipTemplateKind>(lastKind !== undefined && lastKind !== null ? lastKind : PackingSlipTemplateKind.BASIC);

  const onSubmit = () => {
    fetch(`/admin/documents/document-packing-slip-settings/template`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        template: templateKind
      })
    })
    .then(async (response) => {
      if (response.ok) {
        toast.success('Template', {
          description: "New template saved",
        });
      } else {
        const error = await response.json();
        toast.error('Template', {
          description: `New template cannot be saved, some error happened. ${error.message}`,
        });
      }
    })
    .catch((e) => {
      toast.error('Template', {
        description: `New template cannot be saved, some error happened. ${e.toString()}`,
      });
      console.error(e)
    })
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={3} md={3} xl={3}>
        <Grid container rowSpacing={3}>
          <Grid item xs={12} md={12} xl={12}>
            <Alert>Preview is based on the last order</Alert>
          </Grid>
          <Grid item xs={12} md={12} xl={12}>
            <Container>
              <Grid container rowSpacing={3} direction={'column'}>
                <Grid item>
                  <Heading level="h1">
                    Choose template
                  </Heading>
                </Grid>
                <Grid item>
                  <ChooseTemplate lastKind={templateKind} setKind={setTemplateKind}/>
                </Grid>
                <Grid item>
                  <Button variant="primary" onClick={onSubmit}>
                    Save
                  </Button>
                </Grid>
              </Grid>
            </Container>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={6} md={6} xl={6}>
        <ViewExample kind={templateKind}/>
      </Grid>
    </Grid>
  )
}

export const PackingSlipTemplatesTab = () => {
  const [data, setData] = useState<any | undefined>(undefined)

  const [error, setError] = useState<any>(undefined);

  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    fetch(`/admin/documents/document-packing-slip-settings`, {
      credentials: "include",
    })
    .then((res) => res.json())
    .then((result) => {
      setData(result)
      setLoading(false)
    })
    .catch((error) => {
      setError(error);
      console.error(error);
    }) 
  }, [isLoading])
  if (isLoading) {
    return (
      <CircularProgress size={12}/>
    )
  }

  return (
    <TemplatesTabContent lastKind={data?.settings?.template}/>
  )  
}