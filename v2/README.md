Medusa documents is a plugin which provides you ability to generate various documents in PDF format. For supported documents, go to [Supported documents](#supported-documents)

## How to install?

1. Install plugin by adding to your `package.json`:

```json
...
"@rsc-labs/medusa-documents-v2": "0.1.6" // or other available version
...
```
and execute install, e.g. `yarn install`.

2. Add plugin to your `medusa-config.js` with the licence key, which you received:

```js
...
plugins: [
    {
      resolve: "@rsc-labs/medusa-documents-v2",
      options: {}
    }
]
...
```

3. Run migrations, e.g. `npx medusa db:migrate`

## Getting started

After installation of a plugin, you will see new option on the sidebar named `Documents`. This will lead you to such view:

<p align="center">
  <picture>
    <img alt="Medusa documents orders" src="https://raw.githubusercontent.com/RSC-Labs/medusa-documents/refs/heads/main/v2/docs/screenshot-1.JPG">
  </picture>
</p>


**_NOTE:_** This README describes `Invoice` as an example of document.

This is a view of your orders. You can notice that it is very similar to `Orders` view. The important difference is in the last column, when you can see `Actions`. `Actions` can handle different documents. 

Before you can generate `Invoice` you need to be familiar with two things - `Templates` and `Settings`. Let's go firstly to `Settings`.

### Settings

This tab contains settings which are used to generate documents. The most important setting which needs to be set is address. Address reflects information about your company or store, which will be inserted in documents. Go to `Change adddress` to set it.

Depends on the used template, you may want to change a logo or adjust invoice number. Let's just jump now to `Templates`.

### Templates

This tab contains supported templates which are used to generate documents. You may see there very basic templates which will be extended in the future. If you set your `Address` correctly and you have at least one `Order`, you may see a preview how invoice will look like. 

<p align="center">
  <picture>
    <img alt="Medusa documents template" src="https://raw.githubusercontent.com/RSC-Labs/medusa-documents/refs/heads/main/v2/docs/screenshot-2.JPG">
  </picture>
</p>


<b>Note:</b> In preview mode, invoice number is set to 1.

<b>Note:</b> If you have picture of template which you would like to have supported, please raise [issue](https://github.com/RSC-Labs/medusa-documents/issues).


### Supported documents

| Name | Status |
| --- | --- |
| Invoice | :white_check_mark: |
| Packing slip | :white_check_mark: |

### Generating invoice

If you have your `Template` chosen and `Address` set, then you are able to generate invoice. Go to `Orders`, click on `...` and choose `Generate invoice`. You will see new card opened with your invoice.

<b>Note: [We do not store documents, see what it means](#what-means-we-do-not-store-documents)</b>

After invoice generation, you will see assigned number in the column `Last generated invoice`. This is useful, if you want to download your invoice again or decide to generate new one.

### View invoice

If you forgot download your invoice, you may click on document in `Documents` column to see it again.

### Invoice number

By default, invoice number is generated based on the last assigned invoice number. In other words - plugin takes the last generated invoice and takes its number to increment it. 

We know that your businesss may require different numbering. In such case - go to `Settings` tab and click `Change settings` in `Invoice`. You will see that you can change how your invoice number will look like. For instance, you can make something like `ABC123{invoice_number}`. If your last invoice has base number `10`, then you will get `ABC12311` as your next invoice number.

Sometimes you may want to set your next invoice number (for instance when you have many different clients). You can do it by setting `Forced number` in `Settings`. Please remember that this setting will be applied for newly generated invoice and the incrementation will start over from this new number.

<b>Protip:</b> After setting change, you can always go to `Templates` to see a preview with your next invoice number.

## Translation

You can now configure language for generated documents.

**_NOTE:_** We do not support translations of frontend.

You can configure language of documents using `medusa-config.js` file. Here is the example of Polish language:

```js
{
  resolve: `@rsc-labs/medusa-documents-v2`,
  options: {
    document_language: 'pl'
  }
}
```

Available translations can be found here: https://github.com/RSC-Labs/medusa-documents/tree/main/v2/src/modules/documents/assets/i18n/locales.

### How to add my own translations?

You have two options:

- create `translation.json` under `/assets/i18n/locales/{your-language}` and create a pull requests - we will be more than happy to merge it

- create `translation.json` only for local purposes. Then you need to go to `node_modules/@rsc-labs/medusa-documents/assets/i18n/locales/{your-language}` and paste there your translation file.

Please remember that `documentLanguage` in `medusa-config.js`  needs to be equal to `{your-language}`.

## Q&A

### What means "We do not store documents"?

It is simple - every time when you click `Generate invoice` we are taking an `Order` and based on that we generate invoice. The same happens with `View invoice`. It means that if you click generate invoice and your `Order` will change (e.g. line items changed, customer address changed etc.), then `View invoice` will show you the <b>last</b> state of your `Order`. <b>We do not remember Order's state</b>. 

However, we remember such things like: invoice number, address or logo, so everything which you set in `Settings`.

Anyway, we encourage you to save your invoice when you generate.

### I clicked generate invoice, invoice number has been assigned, but I want to go back to previous number

Now you can do it! Just got to `Settings` tab and click `Change settings` in `Invoice`. Use `Forced number` field to put your next invoice number.

### Provided templates are not enough for me, I want more of them, I want customization, I want hide some information etc.

We also see here endless possibilities.. :) Unfortunately, this is a very basic version, but for sure in the future there will be more functionalities.

## Proposals, bugs, improvements

If you have an idea, what could be the next highest priority functionality, do not hesistate raise issue here: [Github issues](https://github.com/RSC-Labs/medusa-documents/issues)

## License

MIT

## Pro version

The Pro version of medusa-documents expands on the features of the free version with more advanced capabilities such as:
- automatically send invoices to customers
- new premium templates
- additional options for configurations, e.g. setting different addresses for various document type
- and a lot more.

The Pro version is available under commercial licence - contact labs@rsoftcon.com for more information.

### Hide Pro version tab

We show what advanced features we offer in "Pro version" tab. We try to keep it non-intruisive, but if you feel it differently, you can always hide this tab by setting following environment variable:
`VITE_MEDUSA_ADMIN_MEDUSA_DOCUMENTS_HIDE_PRO=true`

After restarting your admin application, you shall have this tab hidden.

---

© 2025 RSC https://rsoftcon.com/
