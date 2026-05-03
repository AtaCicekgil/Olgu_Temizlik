import type { GTool } from '../engine/groq'
import { siparisTools,  siparisExecutors  } from './siparis.tools'
import { musteriTools,  musteriExecutors  } from './musteri.tools'
import { cinsTools,     cinsExecutors     } from './cins.tools'
import { giderTools,    giderExecutors    } from './gider.tools'
import { analizTools,   analizExecutors   } from './analiz.tools'
import { smsTools,      smsExecutors      } from './sms.tools'
import { havaTools,     havaExecutors     } from './hava.tools'
import { takvimTools,   takvimExecutors   } from './takvim.tools'
import { personelTools, personelExecutors } from './personel.tools'
import { stokTools,     stokExecutors     } from './stok.tools'
import { ayarlarTools,  ayarlarExecutors  } from './ayarlar.tools'

export const ALL_TOOLS: GTool[] = [
  ...siparisTools,   // 25
  ...musteriTools,   // 15
  ...cinsTools,      // 10
  ...giderTools,     //  8
  ...analizTools,    // 15
  ...smsTools,       // 10
  ...havaTools,      //  6
  ...takvimTools,    //  6
  ...personelTools,  //  6
  ...stokTools,      //  5
  ...ayarlarTools,   //  5
]

const ALL_EXECUTORS: Record<string, (args: Record<string, unknown>) => Promise<unknown>> = {
  ...siparisExecutors,
  ...musteriExecutors,
  ...cinsExecutors,
  ...giderExecutors,
  ...analizExecutors,
  ...smsExecutors,
  ...havaExecutors,
  ...takvimExecutors,
  ...personelExecutors,
  ...stokExecutors,
  ...ayarlarExecutors,
}

export async function executeTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const fn = ALL_EXECUTORS[name]
  if (!fn) throw new Error(`Bilinmeyen tool: ${name}`)
  return fn(args)
}
