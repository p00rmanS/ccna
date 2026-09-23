import type { InteractiveId } from '../../types';
import { BinaryLab, Ipv4Split } from './BinaryIpv4';
import { MacLearning } from './MacLearning';
import { CablePicker, Ipv6Classify, Ipv6Compress, SubnetLister, VlsmPlanner } from './Extra';
import { StpElection } from './Stp';
import { Encapsulation, GuessDevice, MacDecoder } from './Simple';

const MAP: Record<InteractiveId, () => React.JSX.Element> = {
  'cable-picker': CablePicker,
  'subnet-lister': SubnetLister,
  'vlsm-planner': VlsmPlanner,
  'ipv6-compress': Ipv6Compress,
  'ipv6-classify': Ipv6Classify,
  'guess-device': GuessDevice,
  encapsulation: Encapsulation,
  'mac-decoder': MacDecoder,
  'mac-learning': MacLearning,
  'binary-lab': BinaryLab,
  'ipv4-split': Ipv4Split,
  'stp-election': StpElection,
};

export function InteractiveView({ id, caption }: { id: InteractiveId; caption?: string }) {
  const Widget = MAP[id];
  return (
    <div className="lesson-block" style={{ margin: '20px 0' }}>
      {caption && <p className="muted small" style={{ marginBottom: 4 }}>Interactive — {caption}</p>}
      <Widget />
    </div>
  );
}
