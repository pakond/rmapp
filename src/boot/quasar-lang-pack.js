import { Quasar } from 'quasar'

export default async () => {
  let langIso = Quasar.lang.getLocale()
  if (langIso === 'es-es') {
    langIso = langIso.split('-')
    langIso = langIso[0]
  } else {
    langIso = 'en-us'
  }

  try {
    await import('quasar/lang/' + langIso)
      .then(lang => {
        Quasar.lang.set(lang.default)
      })
  } catch (err) {
    // Requested Quasar Language Pack does not exist,
    // let's not break the app, so catching error
  }
}
