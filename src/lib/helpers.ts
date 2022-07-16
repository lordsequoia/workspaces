import {
  adjectives,
  animals,
  colors,
  Config,
  uniqueNamesGenerator,
} from 'unique-names-generator';

export const DEFAULT_RANDOM_NAME_GENERATOR_CONFIG: Config = {
  dictionaries: [adjectives, animals, colors],
  separator: '_',
  length: 3,
};

export const createRandomName = (config?: Config) =>
  uniqueNamesGenerator(config || DEFAULT_RANDOM_NAME_GENERATOR_CONFIG);
