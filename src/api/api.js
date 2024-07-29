import axios from "axios"

export const getImage = (image) => {
  return axios.post('https://fasteasy-jvqis72guq-lm.a.run.app/tz-front/generate_images', image, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${btoa('renesandro:qwerty1234')}`
    }
  })
}
