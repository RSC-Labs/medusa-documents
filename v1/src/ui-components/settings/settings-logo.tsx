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

import { Heading, Text, FocusModal, Button, Input, Label } from "@medusajs/ui"
import { CircularProgress, Grid } from "@mui/material";
import { useAdminCustomPost, useAdminCustomQuery } from "medusa-react"
import { useForm } from "react-hook-form";
import { toast  } from "@medusajs/ui"
import { useState } from "react";
import { AdminStoreDocumentSettingsQueryReq, StoreDocumentSettingsResult } from "../types/api";

type AdminStoreLogoPostReq = {
  logoSource: string
}

const LogoFields = ({ logoSource, register } : {logoSource?: string, register: any}) => {
  const [logoUrl, setLogoUrl] = useState(logoSource);
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [imgLoaded, setIsImageLoaded] = useState(false);

  const handleInputChange = (event) => {
    setLogoUrl(event.target.value);
    setIsValidUrl(true);
  };

  const handleImageError = () => {
    setIsValidUrl(false);
    setIsImageLoaded(false);
  };

  const handleOnLoad = (event) => {
    setIsImageLoaded(true);
  }


  return (
    <Grid container direction={'column'} spacing={1}>
      <Grid item>
        <Label size="small">
          Link to logo
        </Label>
      </Grid>
      <Grid item>
        <Input 
          placeholder='https://raw.githubusercontent.com/RSC-Labs/medusa-store-analytics/main/docs/store-analytics-logo.PNG'
          {...register}
          defaultValue={logoSource}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid container justifyContent={'center'} alignContent={'center'} marginTop={5}>
        <Grid item>
          <div style={{ height: '200px', width: '300px', overflow: 'hidden', border: imgLoaded ? undefined : "1px solid rgba(0, 0, 0, 0.12)" }}>
            {logoUrl && isValidUrl && <Grid item textAlign={'center'}>
              <img src={logoUrl} alt="Preview" style={{ maxWidth: 300, maxHeight: 200 }} onLoad={handleOnLoad} onError={handleImageError} />
            </Grid>
            }
          </div>
        </Grid>
      </Grid>
    </Grid>
  )
}

const LogoForm = ({ logoSource, setOpenModal } : {logoSource?: string, setOpenModal: any}) => {

  const { register, handleSubmit } = useForm<{
    logoSource: string
  }>()

  const { mutate } = useAdminCustomPost<
    AdminStoreLogoPostReq,
    StoreDocumentSettingsResult  
  >
  (
    `/document-settings/logo`,
    ["logo"]
  )
  const onSubmit = (data: {logoSource: string}) => {
    return mutate(
      {
        logoSource: data.logoSource
      }, {
        onSuccess: async ( { response,  settings } ) => {
          if (response.status == 201) {
            if (settings && settings.store_logo_source) {
              toast.success('Logo', {
                description: "New logo saved",
              });
            } else {
              toast.success('Logo', {
                description: "Logo removed",
              });
            }
            setOpenModal(false);
          } else {
            toast.error('Logo', {
              description: "Logo cannot be saved, some error happened.",
            });
          }
        },
        onError: ( { } ) => {
          toast.error('Logo', {
            description: "Logo cannot be saved, some error happened.",
          });
        },
      }
    )  
  }

  return (
    <form>
      <Grid container direction={'column'} rowSpacing={4} paddingTop={8}>
        <LogoFields logoSource={logoSource} register={register('logoSource')}/>
        <Grid item>
          <Button
            type="submit"
            variant={'primary'}
            onClick={handleSubmit(onSubmit)}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}



const LogoModalDetails = ({ setOpenModal }) => {

  const { data, isLoading } = useAdminCustomQuery
  <AdminStoreDocumentSettingsQueryReq, StoreDocumentSettingsResult>(
    "/document-settings",
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
          <Heading>Store logo</Heading>
        </Grid>
        <Grid item>
          <Text>
            This logo will be used on your documents.
          </Text>
        </Grid>
        <Grid item>
          <Text>
            Presence of logo on document depends on template.
          </Text>
        </Grid>
        <Grid item>
          <LogoForm logoSource={data.settings && data.settings.store_logo_source ? data.settings.store_logo_source as string : undefined} setOpenModal={setOpenModal}/>
        </Grid>
      </Grid>
    </FocusModal.Body>
  )
}

const LogoChangeModal = () => {
  const [open, setOpen] = useState(false)

  return (
    <FocusModal
      open={open}
      onOpenChange={setOpen}
    >
      <FocusModal.Trigger asChild>
        <Button>Change logo</Button>
      </FocusModal.Trigger>
      <FocusModal.Content>
        <FocusModal.Header/>
        <LogoModalDetails setOpenModal={setOpen}/>
      </FocusModal.Content>
    </FocusModal>
  )
}


export default LogoChangeModal