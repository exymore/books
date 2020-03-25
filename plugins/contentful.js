import * as contentful from 'contentful';

export default async ({ env }, inject) => {
  const config = {
    space: env.CTF_SPACE_ID,
    accessToken: env.CTF_CDA_ACCESS_TOKEN,
    environment: env.CTF_ENVIRONMENT_ID,
  };
  const client = contentful.createClient(config);
  inject('contentful', () => client);
};
