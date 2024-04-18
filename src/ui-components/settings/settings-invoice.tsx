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

import { Heading, Text, FocusModal, Button, Input, Label, Toaster, Alert } from "@medusajs/ui"
import { CircularProgress, Grid } from "@mui/material";
import { useAdminCustomPost, useAdminCustomQuery } from "medusa-react"
import { useForm } from "react-hook-form";
import { useToast  } from "@medusajs/ui"
import { useState } from "react";
import { AdminStoreDocumentInvoiceSettingsQueryReq, AdminStoreDocumentSettingsQueryReq, StoreDocumentInvoiceSettingsResult, StoreDocumentSettingsResult } from "../types/api";

type AdminStoreInvoiceNumberFormatPostReq = {
  formatNumber: string
}

type InvoiceNumberFormat = {
  formatNumber: string
}

const InvoiceSettingsForm = ({ currentFormatNumber, setOpenModal } : {currentFormatNumber?: string, setOpenModal: any}) => {

  const { toast } = useToast()

  const { register, handleSubmit, formState: { errors } } = useForm<InvoiceNumberFormat>()

  const { mutate } = useAdminCustomPost<
    AdminStoreInvoiceNumberFormatPostReq,
    StoreDocumentInvoiceSettingsResult  
  >
  (
    `/document-invoice-settings/format-number`,
    ["format-number"]
  )
  const onSubmit = (data: InvoiceNumberFormat) => {
    return mutate(
      {
        formatNumber: data.formatNumber
      }, {
        onSuccess: async ( { response,  settings } ) => {
          if (response.status == 201 && settings && settings.invoice_number_format) {
            toast({
              title: 'Format number',
              description: "New format number saved",
              variant: 'success'
            });
            setOpenModal(false);
          } else {
            toast({
              title: 'Format number',
              description: "New format number cannot be saved, some error happened.",
              variant: 'error'
            });
          }
        },
        onError: ( { } ) => {
          toast({
            title: 'Format number',
            description: "New format number cannot be saved, some error happened.",
            variant: 'error'
          });
        },
      }
    )  
  }

  const validateInvoiceNumber = (value) => {
    if (!value.includes('{invoice_number}')) {
      return "Input must contain '{invoice_number}'";
    }
    return true;
  };

  const errorText = `Text {invoice_number} needs to be included in input.`
  const LABEL_MUST = `Format MUST include {invoice_number}`;

  return (
    <form>
      <Grid container direction={'column'} rowSpacing={4} paddingTop={8}>
        <Grid container direction={'column'} spacing={1} marginTop={2}>
          <Grid item>
            <Label size="small">
              Number format
            </Label>
          </Grid>
          <Grid item>
            <Label size='xsmall'>
              {LABEL_MUST}
            </Label>
          </Grid>
          <Grid item>
            <Input 
              placeholder={'{invoice_number}'}
              defaultValue={currentFormatNumber ? currentFormatNumber : '{invoice_number}'}
              {...register('formatNumber', {
                validate: validateInvoiceNumber
              })}
            />
          </Grid>
        </Grid>
        <Grid item>
          <Button
            type="submit"
            variant={'primary'}
            onClick={handleSubmit(onSubmit)}
          >
            Save
          </Button>
        </Grid>
        {errors.formatNumber && <Grid item>
          <Alert variant="error">{errorText}</Alert>
        </Grid>}
      </Grid>
    </form>
  )
}

const InvoiceSettingsModalDetails = ({ setOpenModal }) => {

  const { data, isLoading } = useAdminCustomQuery
  <AdminStoreDocumentInvoiceSettingsQueryReq, StoreDocumentInvoiceSettingsResult>(
    "/document-invoice-settings",
    [''],
    {
    }
  )

  if (isLoading) {
    return (
      <FocusModal.Body>
        <CircularProgress/>
      </FocusModal.Body>
    )
  }

  return (
    <FocusModal.Body>
      <Grid container direction={'column'} alignContent={'center'} paddingTop={8}>
        <Grid item>
          <Heading>Invoice settings</Heading>
        </Grid>
        <Grid item>
          <Text>
            These settings will be applied for newly generated invoices.
          </Text>
        </Grid>
        <Grid item>
          <InvoiceSettingsForm currentFormatNumber={data?.settings?.invoice_number_format} setOpenModal={setOpenModal}/>
        </Grid>
      </Grid>
    </FocusModal.Body>
  )
}

const InvoiceSettingsModal = () => {
  const [open, setOpen] = useState(false)

  return (
    <FocusModal
      open={open}
      onOpenChange={setOpen}
    >
      <FocusModal.Trigger asChild>
        <Button>Change settings</Button>
      </FocusModal.Trigger>
      <FocusModal.Content>
        <FocusModal.Header/>
        <InvoiceSettingsModalDetails setOpenModal={setOpen}/>
      </FocusModal.Content>
    </FocusModal>
  )
}


export default InvoiceSettingsModal