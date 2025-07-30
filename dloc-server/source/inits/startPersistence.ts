import { PersistenceResult } from '../infraestucture/models/PersistenceResult';
import { printMessage } from '../functions/printMessage';
import { getPersistence, setPersistence } from '../persistence/persistence';
import { Persistence } from '../models/Persistence';

/** Timer */
var persistenceTimer: NodeJS.Timeout;

/** Clean Persistence */
const cleanPersistence = () => {
  const persistence = getPersistence();
  if (!persistence) return printMessage(`⛔️ Persistence not ready...`);
  
  printMessage(`🧹 Persistence clean started...`);
  persistence.clean().then((result: PersistenceResult) => {
    if (!result.error) printMessage(`✅ Persistence cleaned...`);
  });
};

const startPersistence = (persistence: Persistence) => {
  /** Set Persistence */
  setPersistence(persistence);

  /** Clean database every hour */
  if (persistenceTimer) clearInterval(persistenceTimer);
  persistenceTimer = setInterval(() => cleanPersistence(), 3600000);

  /** Banner */
  printMessage(`💾 Persistence: [${persistence.getPersistenceName()}]`);
  printMessage(`🎛️ Persistence Config: [${persistence.getPersistenceConfig()}]`);
  persistence.health().then((result) => {
    if (result.error) {
      printMessage(`⛔️ Persistence not ready: ${result.error?.message || result.error}`);
      process.exit(1);
    }
    printMessage(`✅ Persistence checked...`);
    cleanPersistence();
  });
};

export { startPersistence };
