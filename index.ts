import Flex from './flex';

(async () => {
  const FlexInstance = await Flex.createNew('', ''); // TODO: ENV
  const { userStatus } = FlexInstance;
  console.log(userStatus);
})();
