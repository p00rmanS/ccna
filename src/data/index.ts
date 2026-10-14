import type { Flashcard, Lab, Lesson, ModuleOutline, Question } from '../types';
import { CURRICULUM, allModules } from './curriculum';
import * as whatIsANetwork from './lessons/what-is-a-network';
import * as networkDevices from './lessons/network-devices';
import * as lanVsWan from './lessons/lan-vs-wan';
import * as osiModel from './lessons/osi-model';
import * as tcpipModel from './lessons/tcpip-model';
import * as ethernet from './lessons/ethernet';
import * as macAddresses from './lessons/mac-addresses';
import * as switchMacLearning from './lessons/switch-mac-learning';
import * as binaryBasics from './lessons/binary-basics';
import * as ipv4Fundamentals from './lessons/ipv4-fundamentals';
import * as iosFundamentals from './lessons/ios-fundamentals';
import * as cablingPhysical from './lessons/cabling-physical';
import * as subnettingFromZero from './lessons/subnetting-from-zero';
import * as vlsm from './lessons/vlsm';
import * as ipv6Fundamentals from './lessons/ipv6-fundamentals';
import * as ipv6AddressTypes from './lessons/ipv6-address-types';
import * as vlans from './lessons/vlans';
import * as trunking from './lessons/trunking';
import * as interVlanRouting from './lessons/inter-vlan-routing';
import * as whyStp from './lessons/why-stp';
import * as stpFundamentals from './lessons/stp-fundamentals';
import * as rapidPvst from './lessons/rapid-pvst';
import * as stpProtection from './lessons/stp-protection';
import * as etherchannel from './lessons/etherchannel';
import * as cdpLldp from './lessons/cdp-lldp';
import * as dhcpFundamentals from './lessons/dhcp-fundamentals';
import * as dhcpServerRelay from './lessons/dhcp-server-relay';

interface LessonBundle {
  lesson: Lesson;
  questions: Question[];
  flashcards: Flashcard[];
  lab: Lab;
}

const BUNDLES: LessonBundle[] = [
  whatIsANetwork, networkDevices, lanVsWan, osiModel, tcpipModel, ethernet, macAddresses, switchMacLearning, binaryBasics, ipv4Fundamentals,
  iosFundamentals, cablingPhysical, subnettingFromZero, vlsm, ipv6Fundamentals, ipv6AddressTypes,
  vlans, trunking, interVlanRouting, whyStp, stpFundamentals, rapidPvst, stpProtection,
  etherchannel, cdpLldp, dhcpFundamentals, dhcpServerRelay,
];

const byId = new Map(BUNDLES.map((b) => [b.lesson.id, b.lesson]));

/** Lessons in curriculum order (the order the learner should study them). */
export const LESSONS: Lesson[] = CURRICULUM.flatMap((p) => p.modules.flatMap((m) => m.lessonIds))
  .map((id) => byId.get(id))
  .filter((l): l is Lesson => l !== undefined);

export const QUESTIONS: Question[] = BUNDLES.flatMap((b) => b.questions);
export const FLASHCARDS: Flashcard[] = BUNDLES.flatMap((b) => b.flashcards);
export const LABS: Lab[] = BUNDLES.map((b) => b.lab);

export const lessonById = (id: string): Lesson | undefined => byId.get(id);
export const labById = (id: string): Lab | undefined => LABS.find((l) => l.id === id);
export const labForLesson = (lessonId: string): Lab | undefined => LABS.find((l) => l.lessonId === lessonId);
export const questionsForLesson = (lessonId: string): Question[] => QUESTIONS.filter((q) => q.lessonIds.includes(lessonId));
export const flashcardsForLesson = (lessonId: string): Flashcard[] => FLASHCARDS.filter((f) => f.lessonId === lessonId);
export const questionById = (id: string): Question | undefined => QUESTIONS.find((q) => q.id === id);

export const lessonIndex = (id: string): number => LESSONS.findIndex((l) => l.id === id);
export const previousLesson = (id: string): Lesson | undefined => LESSONS[lessonIndex(id) - 1];
export const nextLesson = (id: string): Lesson | undefined => LESSONS[lessonIndex(id) + 1];
export const moduleOfLesson = (lessonId: string): ModuleOutline | undefined => allModules().find((m) => m.lessonIds.includes(lessonId));

export const totalMinutes = (): number => LESSONS.reduce((sum, l) => sum + l.estimatedMinutes, 0);
