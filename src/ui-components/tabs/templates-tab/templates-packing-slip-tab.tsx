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
import { Container, Heading, RadioGroup, Label, Button, useToast } from "@medusajs/ui"
import { useState } from 'react'
import { Grid, CircularProgress } from "@mui/material";
import { PackingSlipTemplateKind } from "../../types/template-kind";
import { useAdminCustomQuery, useAdminCustomPost } from "medusa-react"
import { PackingSlipResult, StoreDocumentPackingSlipSettingsResult, AdminStoreDocumentPackingSlipSettingsQueryReq} from "../../types/api";

type AdminGeneratePackingSlipQueryReq = {
  template: PackingSlipTemplateKind
}

const ViewExample = ({kind} : {kind: PackingSlipTemplateKind}) => {
  const { data, isLoading, isError, error } = useAdminCustomQuery
    <AdminGeneratePackingSlipQueryReq, PackingSlipResult>(
    `/packing-slip/preview`,
    [],
    {
      template: kind
    }
  );
  if (isLoading) {
    return (
      <Grid container justifyContent={'center'}>
        <Grid item>
          <CircularProgress size={12}/>
        </Grid>
      </Grid>
    )
  }
  if (isError) {
    const trueError = error as any;
    if (trueError.response?.data?.message) {
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
  const { toast } = useToast();

  const { mutate } = useAdminCustomPost<
    AdminPackingSlipTemplatePostReq,
    StoreDocumentPackingSlipSettingsResult  
  >
  (
    `/document-packing-slip-settings/template`,
    ["document-packing-slip-settings"]
  )
  const onSubmit = () => {
    return mutate(
      {
        packingSlipTemplate: templateKind
      }, {
        onSuccess: async ( { response,  settings } ) => {
          if (response.status == 201 && settings) {
            toast({
              title: 'Template',
              description: "New template saved",
              variant: 'success'
            });
          } else {
            toast({
              title: 'Template',
              description: "Template cannot be saved, some error happened.",
              variant: 'error'
            });
          }
        },
        onError: ( { } ) => {
          toast({
            title: 'Template',
            description: "Template cannot be saved, some error happened.",
            variant: 'error'
          });
        },
      }
    )  
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
  const { data, isLoading } = useAdminCustomQuery
  <AdminStoreDocumentPackingSlipSettingsQueryReq, StoreDocumentPackingSlipSettingsResult>(
    "/document-packing-slip-settings",
    [''],
    {
    }
  )
  if (isLoading) {
    return (
      <CircularProgress size={12}/>
    )
  }

  return (
    <TemplatesTabContent lastKind={data?.settings?.template}/>
  )  
}