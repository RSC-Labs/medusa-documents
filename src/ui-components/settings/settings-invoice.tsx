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

import { Heading, Text, FocusModal, Button, Input, Label, Alert } from "@medusajs/ui"
import { CircularProgress, Grid } from "@mui/material";
import { useAdminCustomPost, useAdminCustomQuery } from "medusa-react"
import { useForm } from "react-hook-form";
import { useToast  } from "@medusajs/ui"
import { useState } from "react";
import { AdminStoreDocumentInvoiceSettingsPostReq, AdminStoreDocumentInvoiceSettingsQueryReq, DocumentInvoiceSettings, StoreDocumentInvoiceSettingsResult, StoreDocumentSettingsResult } from "../types/api";
import InvoiceSettingsDisplayNumber from "./settings-invoice-display-number";
import { isBoolean } from "lodash";

type InvoiceSettings = {
  formatNumber: string,
  forcedNumber: number
}

const InvoiceSettingsForm = ({ invoiceSettings, setOpenModal } : {invoiceSettings: DocumentInvoiceSettings, setOpenModal: any}) => {

  const { toast } = useToast()

  const { register, handleSubmit, formState: { errors } } = useForm<InvoiceSettings>()
  const [formatNumber, setFormatNumber] = useState(invoiceSettings.invoice_number_format);
  const [forcedNumber, setForcedNumber] = useState(invoiceSettings.invoice_forced_number);
  const [ error, setError ] = useState(undefined);

  const { mutate } = useAdminCustomPost<
    AdminStoreDocumentInvoiceSettingsPostReq,
    StoreDocumentInvoiceSettingsResult  
  >
  (
    `/document-invoice-settings`,
    ['document-invoice-settings']
  )
  const onSubmit = (data: InvoiceSettings) => {
    return mutate(
      {
        formatNumber: data.formatNumber,
        forcedNumber: data.forcedNumber
      }, {
        onSuccess: async ( { response,  settings } ) => {
          if (response.status == 201 && settings) {
            toast({
              title: 'Invoice settings',
              description: "New invoice settings saved",
              variant: 'success'
            });
            setOpenModal(false);
          } else {
            toast({
              title: 'Invoice settings',
              description: "New invoice settings cannot be saved, some error happened.",
              variant: 'error'
            });
          }
        },
        onError: ( { } ) => {
          toast({
            title: 'Invoice settings',
            description: "New invoice settings cannot be saved, some error happened.",
            variant: 'error'
          });
        },
      }
    )  
  }

  const errorText = `Text {invoice_number} needs to be included in input.`
  const LABEL_MUST_FORMAT = `Format must include {invoice_number}`;
  const LABEL_MUST_FORCED = `Forced number must be a number`;
  const LABEL_INFO_FORCED = `It will auto-increment starting from this number.`;

  const validateFormatNumber = (value) => {
    if (!value.includes('{invoice_number}')) {
      return LABEL_MUST_FORMAT;
    }
    return true;
  };
  const validateForcedNumber = (value) => {
    if (value.length && isNaN(Number(value))) {
      return LABEL_MUST_FORCED;
    }
    return true;
  };

  return (
    <form>
      <Grid container direction={'column'} rowSpacing={4} paddingTop={8}>
        <Grid container direction={'column'} spacing={1} marginTop={2}>
          <Grid item>
            <Grid container direction={'column'}>
              <Grid item>
                <Label size="small">
                  Number format
                </Label>
              </Grid>
              <Grid item>
                <Label size='xsmall'>
                  {LABEL_MUST_FORMAT}
                </Label>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Input 
              placeholder={'{invoice_number}'}
              defaultValue={invoiceSettings.invoice_number_format ? invoiceSettings.invoice_number_format : '{invoice_number}'}
              {...register('formatNumber', {
                validate: validateFormatNumber,
                onChange(e) {
                  const value = e.target.value
                  if (isBoolean(validateFormatNumber(value))) {
                    setError(undefined);
                    setFormatNumber(value);
                  } else {
                    setError(validateFormatNumber(value))
                  }
                },
              })}
            />
          </Grid>
        </Grid>
        <Grid container direction={'column'} spacing={1} marginTop={2}>
          <Grid item>
            <Grid container direction={'column'}>
              <Grid item>
                <Label size="small">
                  Forced number
                </Label>
              </Grid>
              <Grid item>
                <Label size='xsmall'>
                  {LABEL_INFO_FORCED}
                </Label>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Input 
              defaultValue={invoiceSettings.invoice_forced_number !== undefined &&  invoiceSettings.invoice_forced_number !== null 
                ? invoiceSettings.invoice_forced_number : ''}
              type="number"
              {...register('forcedNumber', {
                validate: validateForcedNumber,
                onChange(e) {
                  const value = e.target.value
                  if (isBoolean(validateForcedNumber(value))) {
                    setError(undefined);
                    setForcedNumber(value);
                  } else {
                    setError(validateForcedNumber(value))
                  }
                },
              })}
            />
          </Grid>
        </Grid>
        <Grid container direction={'column'} spacing={1} marginTop={2}>
          <Grid item>
            <Label size="small">
              Your next invoice number will be:
            </Label>
          </Grid>
          {errors.formatNumber == undefined && errors.forcedNumber == undefined && error == undefined && <Grid item>
            <InvoiceSettingsDisplayNumber formatNumber={formatNumber} forcedNumber={forcedNumber !== undefined && forcedNumber !== null ? parseInt(forcedNumber) : undefined}/>
          </Grid>}
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
        {(errors.formatNumber || errors.forcedNumber) && <Grid item>
          <Alert variant="error">{errorText}</Alert>
        </Grid>}
          {error && <Grid item>
            <Alert variant="error">{error}</Alert>
          </Grid>}
      </Grid>
    </form>
  )
}

const InvoiceSettingsModalDetails = ({ setOpenModal }) => {

  const { data, isLoading } = useAdminCustomQuery
  <AdminStoreDocumentInvoiceSettingsQueryReq, StoreDocumentInvoiceSettingsResult>(
    "/document-invoice-settings",
    [],
    {
    },
    {
      refetchOnMount: "always",
      cacheTime: 0
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
          <InvoiceSettingsForm invoiceSettings={data?.settings} setOpenModal={setOpenModal}/>
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