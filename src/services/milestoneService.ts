import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  SpaceMilestone,
  MilestoneType,
  MilestoneCategory,
  CountryTimeline,
  TimelineComparison,
  GlobalMilestoneStats,
  MILESTONE_TYPE_INFO,
  ApiErrorResponse
} from '../types';
import { API_CONFIG, ERROR_MESSAGES } from '../constants';

/**
 * Space Milestone Service
 *
 * Provides historical space achievement data and timeline functionality
 * for tracking and comparing national space program milestones with API integration.
 */

// ============================================================================
// MOCK MILESTONE DATA (Fallback)
// ============================================================================

const MOCK_MILESTONES: SpaceMilestone[] = [
  // USSR/Russia Milestones
  {
    id: '1',
    countryId: 'RUS',
    milestoneType: 'FIRST_SATELLITE',
    category: 'orbital',
    dateAchieved: '1957-10-04',
    year: 1957,
    globalRank: 1,
    isFirst: true,
    title: 'First Artificial Satellite',
    description: 'Sputnik 1 became the first artificial satellite to orbit Earth, marking the start of the Space Age.',
    achievedBy: 'Sputnik 1',
    significance: 'major',
    wikiUrl: 'https://en.wikipedia.org/wiki/Sputnik_1'
  },
  {
    id: '2',
    countryId: 'RUS',
    milestoneType: 'FIRST_ANIMAL_IN_SPACE',
    category: 'orbital',
    dateAchieved: '1957-11-03',
    year: 1957,
    globalRank: 1,
    isFirst: true,
    title: 'First Animal in Orbit',
    description: 'Laika the dog became the first living creature to orbit Earth aboard Sputnik 2.',
    achievedBy: 'Laika (Sputnik 2)',
    significance: 'major',
    wikiUrl: 'https://en.wikipedia.org/wiki/Laika'
  },
  {
    id: '3',
    countryId: 'RUS',
    milestoneType: 'FIRST_HUMAN_IN_SPACE',
    category: 'human',
    dateAchieved: '1961-04-12',
    year: 1961,
    globalRank: 1,
    isFirst: true,
    title: 'First Human in Space',
    description: 'Yuri Gagarin became the first human to journey into outer space and orbit Earth.',
    achievedBy: 'Yuri Gagarin (Vostok 1)',
    significance: 'major',
    wikiUrl: 'https://en.wikipedia.org/wiki/Yuri_Gagarin'
  },
  {
    id: '4',
    countryId: 'RUS',
    milestoneType: 'FIRST_WOMAN_IN_SPACE',
    category: 'human',
    dateAchieved: '1963-06-16',
    year: 1963,
    globalRank: 1,
    isFirst: true,
    title: 'First Woman in Space',
    description: 'Valentina Tereshkova became the first woman to fly in space.',
    achievedBy: 'Valentina Tereshkova (Vostok 6)',
    significance: 'major',
    wikiUrl: 'https://en.wikipedia.org/wiki/Valentina_Tereshkova'
  },
  {
    id: '5',
    countryId: 'RUS',
    milestoneType: 'FIRST_SPACEWALK',
    category: 'human',
    dateAchieved: '1965-03-18',
    year: 1965,
    globalRank: 1,
    isFirst: true,
    title: 'First Spacewalk',
    description: 'Alexei Leonov performed the first extravehicular activity (EVA) in space.',
    achievedBy: 'Alexei Leonov (Voskhod 2)',
    significance: 'major',
    wikiUrl: 'https://en.wikipedia.org/wiki/Alexei_Leonov'
  },
  {
    id: '6',
    countryId: 'RUS',
    milestoneType: 'FIRST_LUNAR_IMPACT',
    category: 'lunar',
    dateAchieved: '1959-09-14',
    year: 1959,
    globalRank: 1,
    isFirst: true,
    title: 'First Lunar Impact',
    description: 'Luna 2 became the first spacecraft to reach the Moon\'s surface.',
    achievedBy: 'Luna 2',
    significance: 'major',
    wikiUrl: 'https://en.wikipedia.org/wiki/Luna_2'
  },
  {
    id: '7',
    countryId: 'RUS',
    milestoneType: 'FIRST_LUNAR_LANDING_ROBOTIC',
    category: 'lunar',
    dateAchieved: '1966-02-03',
    year: 1966,
    globalRank: 1,
    isFirst: true,
    title: 'First Lunar Soft Landing',
    description: 'Luna 9 achieved the first successful soft landing on the Moon.',
    achievedBy: 'Luna 9',
    significance: 'major',
    wikiUrl: 'https://en.wikipedia.org/wiki/Luna_9'
  },
  {
    id: '8',
    countryId: 'RUS',
    milestoneType: 'FIRST_LUNAR_ORBIT',
    category: 'lunar',
    dateAchieved: '1966-04-03',
    year: 1966,
    globalRank: 1,
    isFirst: true,
    title: 'First Lunar Orbit',
    description: 'Luna 10 became the first spacecraft to orbit the Moon.',
    achievedBy: 'Luna 10',
    significance: 'significant',
    wikiUrl: 'https://en.wikipedia.org/wiki/Luna_10'
  },
  {
    id: '9',
    countryId: 'RUS',
    milestoneType: 'FIRST_VENUS_LANDING',
    category: 'planetary',
    dateAchieved: '1970-12-15',
    year: 1970,
    globalRank: 1,
    isFirst: true,
    title: 'First Venus Landing',
    description: 'Venera 7 became the first spacecraft to land on Venus and transmit data.',
    achievedBy: 'Venera 7',
    significance: 'major',
    wikiUrl: 'https://en.wikipedia.org/wiki/Venera_7'
  },
  {
    id: '10',
    countryId: 'RUS',
    milestoneType: 'FIRST_SPACE_STATION',
    category: 'orbital',
    dateAchieved: '1971-04-19',
    year: 1971,
    globalRank: 1,
    isFirst: true,
    title: 'First Space Station',
    description: 'Salyut 1 became the first space station to orbit Earth.',
    achievedBy: 'Salyut 1',
    significance: 'major',
    wikiUrl: 'https://en.wikipedia.org/wiki/Salyut_1'
  },
  {
    id: '11',
    countryId: 'RUS',
    milestoneType: 'FIRST_LUNAR_ROVER',
    category: 'lunar',
    dateAchieved: '1970-11-17',
    year: 1970,
    globalRank: 1,
    isFirst: true,
    title: 'First Lunar Rover',
    description: 'Lunokhod 1 became the first robotic rover to operate on another celestial body.',
    achievedBy: 'Lunokhod 1',
    significance: 'major',
    wikiUrl: 'https://en.wikipedia.org/wiki/Lunokhod_1'
  },

  // USA Milestones
  {
    id: '20',
    countryId: 'USA',
    milestoneType: 'FIRST_SATELLITE',
    category: 'orbital',
    dateAchieved: '1958-02-01',
    year: 1958,
    globalRank: 2,
    isFirst: false,
    title: 'First American Satellite',
    description: 'Explorer 1 became the first American artificial satellite.',
    achievedBy: 'Explorer 1',
    significance: 'significant',
    wikiUrl: 'https://en.wikipedia.org/wiki/Explorer_1'
  },
  {
    id: '21',
    countryId: 'USA',
    milestoneType: 'FIRST_HUMAN_IN_SPACE',
    category: 'human',
    dateAchieved: '1961-05-05',
    year: 1961,
    globalRank: 2,
    isFirst: false,
    title: 'First American in Space',
    description: 'Alan Shepard became the first American in space on a suborbital flight.',
    achievedBy: 'Alan Shepard (Freedom 7)',
    significance: 'significant',
    wikiUrl: 'https://en.wikipedia.org/wiki/Alan_Shepard'
  },
  {
    id: '22',
    countryId: 'USA',
    milestoneType: 'FIRST_HUMAN_LUNAR_ORBIT',
    category: 'lunar',
    dateAchieved: '1968-12-24',
    year: 1968,
    globalRank: 1,
    isFirst: true,
    title: 'First Humans to Orbit the Moon',
    description: 'Apollo 8 became the first crewed mission to orbit the Moon.',
    achievedBy: 'Apollo 8 (Borman, Lovell, Anders)',
    significance: 'major',
    wikiUrl: 'https://en.wikipedia.org/wiki/Apollo_8'
  },
  {
    id: '23',
    countryId: 'USA',
    milestoneType: 'FIRST_HUMAN_LUNAR_LANDING',
    category: 'lunar',
    dateAchieved: '1969-07-20',
    year: 1969,
    globalRank: 1,
    isFirst: true,
    title: 'First Humans on the Moon',
    description: 'Neil Armstrong and Buzz Aldrin became the first humans to walk on the Moon.',
    achievedBy: 'Apollo 11 (Armstrong, Aldrin, Collins)',
    significance: 'major',
    wikiUrl: 'https://en.wikipedia.org/wiki/Apollo_11'
  },
  {
    id: '24',
    countryId: 'USA',
    milestoneType: 'FIRST_MARS_FLYBY',
    category: 'planetary',
    dateAchieved: '1965-07-15',
    year: 1965,
    globalRank: 1,
    isFirst: true,
    title: 'First Mars Flyby',
    description: 'Mariner 4 became the first spacecraft to fly by Mars and return images.',
    achievedBy: 'Mariner 4',
    significance: 'major',
    wikiUrl: 'https://en.wikipedia.org/wiki/Mariner_4'
  },
  {
    id: '25',
    countryId: 'USA',
    milestoneType: 'FIRST_MARS_ORBIT',
    category: 'planetary',
    dateAchieved: '1971-11-14',
    year: 1971,
    globalRank: 1,
    isFirst: true,
    title: 'First Mars Orbit',
    description: 'Mariner 9 became the first spacecraft to orbit Mars.',
    achievedBy: 'Mariner 9',
    significance: 'major',
    wikiUrl: 'https://en.wikipedia.org/wiki/Mariner_9'
  },
  {
    id: '26',
    countryId: 'USA',
    milestoneType: 'FIRST_MARS_LANDING',
    category: 'planetary',
    dateAchieved: '1976-07-20',
    year: 1976,
    globalRank: 1,
    isFirst: true,
    title: 'First Mars Landing',
    description: 'Viking 1 became the first spacecraft to successfully land on Mars.',
    achievedBy: 'Viking 1',
    significance: 'major',
    wikiUrl: 'https://en.wikipedia.org/wiki/Viking_1'
  },
  {
    id: '27',
    countryId: 'USA',
    milestoneType: 'FIRST_JUPITER_FLYBY',
    category: 'planetary',
    dateAchieved: '1973-12-03',
    year: 1973,
    globalRank: 1,
    isFirst: true,
    title: 'First Jupiter Flyby',
    description: 'Pioneer 10 became the first spacecraft to fly by Jupiter.',
    achievedBy: 'Pioneer 10',
    significance: 'major',
    wikiUrl: 'https://en.wikipedia.org/wiki/Pioneer_10'
  },
  {
    id: '28',
    countryId: 'USA',
    milestoneType: 'FIRST_SATURN_ORBIT',
    category: 'planetary',
    dateAchieved: '2004-07-01',
    year: 2004,
    globalRank: 1,
    isFirst: true,
    title: 'First Saturn Orbit',
    description: 'Cassini became the first spacecraft to orbit Saturn.',
    achievedBy: 'Cassini',
    significance: 'major',
    wikiUrl: 'https://en.wikipedia.org/wiki/Cassini%E2%80%93Huygens'
  },
  {
    id: '29',
    countryId: 'USA',
    milestoneType: 'FIRST_MARS_ROVER',
    category: 'planetary',
    dateAchieved: '1997-07-04',
    year: 1997,
    globalRank: 1,
    isFirst: true,
    title: 'First Mars Rover',
    description: 'Sojourner became the first rover to operate on Mars.',
    achievedBy: 'Sojourner (Mars Pathfinder)',
    significance: 'major',
    wikiUrl: 'https://en.wikipedia.org/wiki/Sojourner_(rover)'
  },
  {
    id: '30',
    countryId: 'USA',
    milestoneType: 'FIRST_MERCURY_ORBIT',
    category: 'planetary',
    dateAchieved: '2011-03-18',
    year: 2011,
    globalRank: 1,
    isFirst: true,
    title: 'First Mercury Orbit',
    description: 'MESSENGER became the first spacecraft to orbit Mercury.',
    achievedBy: 'MESSENGER',
    significance: 'significant',
    wikiUrl: 'https://en.wikipedia.org/wiki/MESSENGER'
  },
  {
    id: '31',
    countryId: 'USA',
    milestoneType: 'FIRST_INTERSTELLAR_PROBE',
    category: 'other',
    dateAchieved: '2012-08-25',
    year: 2012,
    globalRank: 1,
    isFirst: true,
    title: 'First Interstellar Probe',
    description: 'Voyager 1 became the first spacecraft to enter interstellar space.',
    achievedBy: 'Voyager 1',
    significance: 'major',
    wikiUrl: 'https://en.wikipedia.org/wiki/Voyager_1'
  },
  {
    id: '32',
    countryId: 'USA',
    milestoneType: 'FIRST_REUSABLE_ROCKET',
    category: 'technology',
    dateAchieved: '2015-12-21',
    year: 2015,
    globalRank: 1,
    isFirst: true,
    title: 'First Orbital-Class Reusable Rocket',
    description: 'SpaceX Falcon 9 became the first orbital rocket to land successfully for reuse.',
    achievedBy: 'Falcon 9 (SpaceX)',
    significance: 'major',
    wikiUrl: 'https://en.wikipedia.org/wiki/Falcon_9'
  },
  {
    id: '33',
    countryId: 'USA',
    milestoneType: 'FIRST_PROPULSIVE_LANDING',
    category: 'technology',
    dateAchieved: '2015-12-21',
    year: 2015,
    globalRank: 1,
    isFirst: true,
    title: 'First Propulsive Rocket Landing',
    description: 'SpaceX achieved the first propulsive landing of an orbital-class rocket booster.',
    achievedBy: 'Falcon 9 (SpaceX)',
    significance: 'major',
    wikiUrl: 'https://en.wikipedia.org/wiki/SpaceX_reusable_launch_system_development_program'
  },
  {
    id: '34',
    countryId: 'USA',
    milestoneType: 'FIRST_COMMERCIAL_CREW',
    category: 'technology',
    dateAchieved: '2020-05-30',
    year: 2020,
    globalRank: 1,
    isFirst: true,
    title: 'First Commercial Crewed Mission',
    description: 'SpaceX Crew Dragon became the first commercially-operated spacecraft to carry humans to orbit.',
    achievedBy: 'Crew Dragon Demo-2 (SpaceX)',
    significance: 'major',
    wikiUrl: 'https://en.wikipedia.org/wiki/Crew_Dragon_Demo-2'
  },
  {
    id: '35',
    countryId: 'USA',
    milestoneType: 'FIRST_MARS_HELICOPTER',
    category: 'planetary',
    dateAchieved: '2021-04-19',
    year: 2021,
    globalRank: 1,
    isFirst: true,
    title: 'First Powered Flight on Mars',
    description: 'Ingenuity became the first aircraft to fly on another planet.',
    achievedBy: 'Ingenuity (Mars 2020)',
    significance: 'major',
    wikiUrl: 'https://en.wikipedia.org/wiki/Ingenuity_(helicopter)'
  },
  {
    id: '36',
    countryId: 'USA',
    milestoneType: 'FIRST_ASTEROID_LANDING',
    category: 'other',
    dateAchieved: '2001-02-12',
    year: 2001,
    globalRank: 1,
    isFirst: true,
    title: 'First Asteroid Landing',
    description: 'NEAR Shoemaker became the first spacecraft to land on an asteroid.',
    achievedBy: 'NEAR Shoemaker (433 Eros)',
    significance: 'significant',
    wikiUrl: 'https://en.wikipedia.org/wiki/NEAR_Shoemaker'
  },
  {
    id: '37',
    countryId: 'USA',
    milestoneType: 'FIRST_ROCKET_CATCH',
    category: 'technology',
    dateAchieved: '2024-10-13',
    year: 2024,
    globalRank: 1,
    isFirst: true,
    title: 'First Rocket Catch by Tower',
    description: 'SpaceX caught a Super Heavy booster using the launch tower "chopsticks".',
    achievedBy: 'Starship Flight 5 (SpaceX)',
    significance: 'major',
    wikiUrl: 'https://en.wikipedia.org/wiki/SpaceX_Starship'
  },

  // China Milestones
  {
    id: '40',
    countryId: 'CHN',
    milestoneType: 'FIRST_SATELLITE',
    category: 'orbital',
    dateAchieved: '1970-04-24',
    year: 1970,
    globalRank: 5,
    isFirst: false,
    title: 'First Chinese Satellite',
    description: 'Dong Fang Hong I became China\'s first artificial satellite.',
    achievedBy: 'Dong Fang Hong I',
    significance: 'significant',
    wikiUrl: 'https://en.wikipedia.org/wiki/Dong_Fang_Hong_I'
  },
  {
    id: '41',
    countryId: 'CHN',
    milestoneType: 'FIRST_HUMAN_IN_SPACE',
    category: 'human',
    dateAchieved: '2003-10-15',
    year: 2003,
    globalRank: 3,
    isFirst: false,
    title: 'First Chinese in Space',
    description: 'Yang Liwei became the first Chinese astronaut (taikonaut) in space.',
    achievedBy: 'Yang Liwei (Shenzhou 5)',
    significance: 'major',
    wikiUrl: 'https://en.wikipedia.org/wiki/Yang_Liwei'
  },
  {
    id: '42',
    countryId: 'CHN',
    milestoneType: 'FIRST_SPACEWALK',
    category: 'human',
    dateAchieved: '2008-09-27',
    year: 2008,
    globalRank: 3,
    isFirst: false,
    title: 'First Chinese Spacewalk',
    description: 'Zhai Zhigang performed China\'s first spacewalk.',
    achievedBy: 'Zhai Zhigang (Shenzhou 7)',
    significance: 'significant',
    wikiUrl: 'https://en.wikipedia.org/wiki/Zhai_Zhigang'
  },
  {
    id: '43',
    countryId: 'CHN',
    milestoneType: 'FIRST_SPACE_STATION',
    category: 'orbital',
    dateAchieved: '2011-09-29',
    year: 2011,
    globalRank: 3,
    isFirst: false,
    title: 'First Chinese Space Station',
    description: 'Tiangong-1 became China\'s first space station.',
    achievedBy: 'Tiangong-1',
    significance: 'significant',
    wikiUrl: 'https://en.wikipedia.org/wiki/Tiangong-1'
  },
  {
    id: '44',
    countryId: 'CHN',
    milestoneType: 'FIRST_LUNAR_LANDING_ROBOTIC',
    category: 'lunar',
    dateAchieved: '2013-12-14',
    year: 2013,
    globalRank: 3,
    isFirst: false,
    title: 'First Chinese Lunar Landing',
    description: 'Chang\'e 3 became the first Chinese spacecraft to soft-land on the Moon.',
    achievedBy: 'Chang\'e 3',
    significance: 'major',
    wikiUrl: 'https://en.wikipedia.org/wiki/Chang%27e_3'
  },
  {
    id: '45',
    countryId: 'CHN',
    milestoneType: 'FIRST_LUNAR_FAR_SIDE_LANDING',
    category: 'lunar',
    dateAchieved: '2019-01-03',
    year: 2019,
    globalRank: 1,
    isFirst: true,
    title: 'First Lunar Far Side Landing',
    description: 'Chang\'e 4 became the first spacecraft to land on the far side of the Moon.',
    achievedBy: 'Chang\'e 4',
    significance: 'major',
    wikiUrl: 'https://en.wikipedia.org/wiki/Chang%27e_4'
  },
  {
    id: '46',
    countryId: 'CHN',
    milestoneType: 'FIRST_LUNAR_SAMPLE_RETURN',
    category: 'lunar',
    dateAchieved: '2020-12-16',
    year: 2020,
    globalRank: 3,
    isFirst: false,
    title: 'First Chinese Lunar Sample Return',
    description: 'Chang\'e 5 returned lunar samples to Earth, the first since 1976.',
    achievedBy: 'Chang\'e 5',
    significance: 'major',
    wikiUrl: 'https://en.wikipedia.org/wiki/Chang%27e_5'
  },
  {
    id: '47',
    countryId: 'CHN',
    milestoneType: 'FIRST_MARS_ORBIT',
    category: 'planetary',
    dateAchieved: '2021-02-10',
    year: 2021,
    globalRank: 6,
    isFirst: false,
    title: 'First Chinese Mars Orbit',
    description: 'Tianwen-1 entered Mars orbit, China\'s first interplanetary mission.',
    achievedBy: 'Tianwen-1',
    significance: 'major',
    wikiUrl: 'https://en.wikipedia.org/wiki/Tianwen-1'
  },
  {
    id: '48',
    countryId: 'CHN',
    milestoneType: 'FIRST_MARS_ROVER',
    category: 'planetary',
    dateAchieved: '2021-05-22',
    year: 2021,
    globalRank: 2,
    isFirst: false,
    title: 'First Chinese Mars Rover',
    description: 'Zhurong became the second rover to operate on Mars.',
    achievedBy: 'Zhurong (Tianwen-1)',
    significance: 'major',
    wikiUrl: 'https://en.wikipedia.org/wiki/Zhurong_(rover)'
  },

  // ESA/Europe Milestones
  {
    id: '50',
    countryId: 'EUR',
    milestoneType: 'FIRST_COMET_LANDING',
    category: 'other',
    dateAchieved: '2014-11-12',
    year: 2014,
    globalRank: 1,
    isFirst: true,
    title: 'First Comet Landing',
    description: 'Philae became the first spacecraft to land on a comet.',
    achievedBy: 'Philae (Rosetta)',
    significance: 'major',
    wikiUrl: 'https://en.wikipedia.org/wiki/Philae_(spacecraft)'
  },
  {
    id: '51',
    countryId: 'EUR',
    milestoneType: 'FIRST_MARS_ORBIT',
    category: 'planetary',
    dateAchieved: '2003-12-25',
    year: 2003,
    globalRank: 3,
    isFirst: false,
    title: 'First European Mars Orbit',
    description: 'Mars Express became the first European spacecraft to orbit Mars.',
    achievedBy: 'Mars Express',
    significance: 'significant',
    wikiUrl: 'https://en.wikipedia.org/wiki/Mars_Express'
  },

  // Japan Milestones
  {
    id: '60',
    countryId: 'JPN',
    milestoneType: 'FIRST_SATELLITE',
    category: 'orbital',
    dateAchieved: '1970-02-11',
    year: 1970,
    globalRank: 4,
    isFirst: false,
    title: 'First Japanese Satellite',
    description: 'Ohsumi became Japan\'s first artificial satellite.',
    achievedBy: 'Ohsumi',
    significance: 'significant',
    wikiUrl: 'https://en.wikipedia.org/wiki/%C5%8Csumi_(satellite)'
  },
  {
    id: '61',
    countryId: 'JPN',
    milestoneType: 'FIRST_SAMPLE_RETURN_ASTEROID',
    category: 'other',
    dateAchieved: '2010-06-13',
    year: 2010,
    globalRank: 1,
    isFirst: true,
    title: 'First Asteroid Sample Return',
    description: 'Hayabusa returned the first samples from an asteroid to Earth.',
    achievedBy: 'Hayabusa (25143 Itokawa)',
    significance: 'major',
    wikiUrl: 'https://en.wikipedia.org/wiki/Hayabusa'
  },

  // India Milestones
  {
    id: '70',
    countryId: 'IND',
    milestoneType: 'FIRST_SATELLITE',
    category: 'orbital',
    dateAchieved: '1980-07-18',
    year: 1980,
    globalRank: 7,
    isFirst: false,
    title: 'First Indian Satellite Launch',
    description: 'Rohini became India\'s first satellite launched by an Indian rocket.',
    achievedBy: 'Rohini (SLV-3)',
    significance: 'significant',
    wikiUrl: 'https://en.wikipedia.org/wiki/Rohini_(satellite)'
  },
  {
    id: '71',
    countryId: 'IND',
    milestoneType: 'FIRST_MARS_ORBIT',
    category: 'planetary',
    dateAchieved: '2014-09-24',
    year: 2014,
    globalRank: 4,
    isFirst: false,
    title: 'First Indian Mars Orbit',
    description: 'Mars Orbiter Mission made India the first Asian country to reach Mars orbit.',
    achievedBy: 'Mangalyaan (MOM)',
    significance: 'major',
    wikiUrl: 'https://en.wikipedia.org/wiki/Mars_Orbiter_Mission'
  },
  {
    id: '72',
    countryId: 'IND',
    milestoneType: 'FIRST_LUNAR_LANDING_ROBOTIC',
    category: 'lunar',
    dateAchieved: '2023-08-23',
    year: 2023,
    globalRank: 4,
    isFirst: false,
    title: 'First Indian Lunar Landing',
    description: 'Chandrayaan-3 achieved the first Indian soft landing on the Moon.',
    achievedBy: 'Chandrayaan-3',
    significance: 'major',
    wikiUrl: 'https://en.wikipedia.org/wiki/Chandrayaan-3'
  },

  // Israel Milestones
  {
    id: '80',
    countryId: 'ISR',
    milestoneType: 'FIRST_SATELLITE',
    category: 'orbital',
    dateAchieved: '1988-09-19',
    year: 1988,
    globalRank: 8,
    isFirst: false,
    title: 'First Israeli Satellite',
    description: 'Ofeq 1 made Israel the eighth nation to launch a satellite.',
    achievedBy: 'Ofeq 1 (Shavit)',
    significance: 'significant',
    wikiUrl: 'https://en.wikipedia.org/wiki/Ofeq_1'
  }
];

// Country name mapping
const COUNTRY_NAMES: Record<string, string> = {
  'USA': 'United States',
  'RUS': 'Russia',
  'CHN': 'China',
  'EUR': 'European Space Agency',
  'JPN': 'Japan',
  'IND': 'India',
  'ISR': 'Israel'
};

// ============================================================================
// SERVICE CLASS WITH API INTEGRATION
// ============================================================================

class SpaceMilestoneService {
  private axiosInstance: AxiosInstance;
  private useMockData: boolean = false;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
    });

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => this.handleError(error)
    );
  }

  private handleError(error: AxiosError<ApiErrorResponse>): Promise<never> {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || ERROR_MESSAGES.INTERNAL_ERROR;
      console.error(`Milestone API Error [${status}]:`, message);
    } else if (error.request) {
      console.error('Network Error:', ERROR_MESSAGES.NETWORK_ERROR);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }

  private sortByDate(milestones: SpaceMilestone[], descending = false): SpaceMilestone[] {
    return [...milestones].sort((a, b) => {
      const dateA = new Date(a.dateAchieved).getTime();
      const dateB = new Date(b.dateAchieved).getTime();
      return descending ? dateB - dateA : dateA - dateB;
    });
  }

  // ============================================================================
  // CRUD OPERATIONS
  // ============================================================================

  async getAll(): Promise<SpaceMilestone[]> {
    if (this.useMockData) {
      return this.sortByDate(MOCK_MILESTONES);
    }
    try {
      const response = await this.axiosInstance.get<SpaceMilestone[]>('/milestones');
      return this.sortByDate(response.data);
    } catch (error) {
      console.warn('Falling back to mock milestone data');
      this.useMockData = true;
      return this.sortByDate(MOCK_MILESTONES);
    }
  }

  // Legacy method name
  getAllMilestones(): Promise<SpaceMilestone[]> {
    return this.getAll();
  }

  async getById(id: string | number): Promise<SpaceMilestone | undefined> {
    if (this.useMockData) {
      return MOCK_MILESTONES.find(m => m.id === id);
    }
    try {
      const response = await this.axiosInstance.get<SpaceMilestone>(`/milestones/${id}`);
      return response.data;
    } catch (error) {
      return MOCK_MILESTONES.find(m => m.id === id);
    }
  }

  // Legacy method name
  getMilestoneById(id: string | number): Promise<SpaceMilestone | undefined> {
    return this.getById(id);
  }

  async create(milestone: Partial<SpaceMilestone>): Promise<SpaceMilestone> {
    const response = await this.axiosInstance.post<SpaceMilestone>('/milestones', milestone);
    return response.data;
  }

  async update(id: string | number, milestone: Partial<SpaceMilestone>): Promise<SpaceMilestone> {
    const response = await this.axiosInstance.put<SpaceMilestone>(`/milestones/${id}`, milestone);
    return response.data;
  }

  async delete(id: string | number): Promise<void> {
    await this.axiosInstance.delete(`/milestones/${id}`);
  }

  // ============================================================================
  // COUNTRY FILTERS
  // ============================================================================

  async getByCountry(countryId: string | number): Promise<SpaceMilestone[]> {
    try {
      const response = await this.axiosInstance.get<SpaceMilestone[]>(`/milestones/by-country/${countryId}`);
      return this.sortByDate(response.data);
    } catch (error) {
      const all = await this.getAll();
      return all.filter(m => m.countryId === countryId);
    }
  }

  // Legacy method name
  getMilestonesByCountry(countryId: string | number): Promise<SpaceMilestone[]> {
    return this.getByCountry(countryId);
  }

  async getByCountryCode(isoCode: string): Promise<SpaceMilestone[]> {
    try {
      const response = await this.axiosInstance.get<SpaceMilestone[]>(`/milestones/by-country-code/${isoCode}`);
      return this.sortByDate(response.data);
    } catch (error) {
      return this.getByCountry(isoCode);
    }
  }

  // ============================================================================
  // TYPE & CATEGORY FILTERS
  // ============================================================================

  async getByType(type: MilestoneType): Promise<SpaceMilestone[]> {
    try {
      const response = await this.axiosInstance.get<SpaceMilestone[]>(`/milestones/by-type/${type}`);
      return response.data.sort((a, b) => a.globalRank - b.globalRank);
    } catch (error) {
      const all = await this.getAll();
      return all.filter(m => m.milestoneType === type).sort((a, b) => a.globalRank - b.globalRank);
    }
  }

  // Legacy method name
  getMilestonesByType(type: MilestoneType): Promise<SpaceMilestone[]> {
    return this.getByType(type);
  }

  async getByCategory(category: MilestoneCategory): Promise<SpaceMilestone[]> {
    try {
      const response = await this.axiosInstance.get<SpaceMilestone[]>(`/milestones/by-category/${category}`);
      return this.sortByDate(response.data);
    } catch (error) {
      const all = await this.getAll();
      return all.filter(m => m.category === category);
    }
  }

  // Legacy method name
  getMilestonesByCategory(category: MilestoneCategory): Promise<SpaceMilestone[]> {
    return this.getByCategory(category);
  }

  async getBySignificance(significance: string): Promise<SpaceMilestone[]> {
    try {
      const response = await this.axiosInstance.get<SpaceMilestone[]>(`/milestones/by-significance/${significance}`);
      return this.sortByDate(response.data);
    } catch (error) {
      const all = await this.getAll();
      return all.filter(m => m.significance === significance);
    }
  }

  // ============================================================================
  // FIRSTS & RANKINGS
  // ============================================================================

  async getFirsts(): Promise<SpaceMilestone[]> {
    try {
      const response = await this.axiosInstance.get<SpaceMilestone[]>('/milestones/firsts');
      return this.sortByDate(response.data);
    } catch (error) {
      const all = await this.getAll();
      return all.filter(m => m.isFirst);
    }
  }

  // Legacy method name
  getFirstAchievements(): Promise<SpaceMilestone[]> {
    return this.getFirsts();
  }

  async getByRank(rank: number): Promise<SpaceMilestone[]> {
    try {
      const response = await this.axiosInstance.get<SpaceMilestone[]>(`/milestones/by-rank/${rank}`);
      return this.sortByDate(response.data);
    } catch (error) {
      const all = await this.getAll();
      return all.filter(m => m.globalRank === rank);
    }
  }

  async getCountryFirsts(countryId: string | number): Promise<SpaceMilestone[]> {
    try {
      const response = await this.axiosInstance.get<SpaceMilestone[]>(`/milestones/by-country/${countryId}/firsts`);
      return this.sortByDate(response.data);
    } catch (error) {
      const countryMilestones = await this.getByCountry(countryId);
      return countryMilestones.filter(m => m.isFirst);
    }
  }

  // ============================================================================
  // TEMPORAL QUERIES
  // ============================================================================

  async getByYear(year: number): Promise<SpaceMilestone[]> {
    try {
      const response = await this.axiosInstance.get<SpaceMilestone[]>(`/milestones/by-year/${year}`);
      return this.sortByDate(response.data);
    } catch (error) {
      const all = await this.getAll();
      return all.filter(m => m.year === year);
    }
  }

  async getByYearRange(startYear: number, endYear: number): Promise<SpaceMilestone[]> {
    try {
      const response = await this.axiosInstance.get<SpaceMilestone[]>('/milestones/by-year-range', {
        params: { startYear, endYear }
      });
      return this.sortByDate(response.data);
    } catch (error) {
      const all = await this.getAll();
      return all.filter(m => m.year >= startYear && m.year <= endYear);
    }
  }

  // Legacy method name
  getMilestonesByYearRange(startYear: number, endYear: number): Promise<SpaceMilestone[]> {
    return this.getByYearRange(startYear, endYear);
  }

  async getByDecade(decade: number): Promise<SpaceMilestone[]> {
    try {
      const response = await this.axiosInstance.get<SpaceMilestone[]>(`/milestones/by-decade/${decade}`);
      return this.sortByDate(response.data);
    } catch (error) {
      return this.getByYearRange(decade, decade + 9);
    }
  }

  async getRecent(limit?: number): Promise<SpaceMilestone[]> {
    try {
      const response = await this.axiosInstance.get<SpaceMilestone[]>('/milestones/recent', {
        params: limit ? { limit } : undefined
      });
      return response.data;
    } catch (error) {
      const all = await this.getAll();
      return this.sortByDate(all, true).slice(0, limit || 10);
    }
  }

  // ============================================================================
  // TIMELINES
  // ============================================================================

  async getCountryTimeline(countryId: string | number): Promise<CountryTimeline> {
    try {
      const response = await this.axiosInstance.get<CountryTimeline>(`/milestones/timeline/${countryId}`);
      return response.data;
    } catch (error) {
      // Fallback to local calculation
      const countryMilestones = await this.getByCountry(countryId);
      const firstAchievements = countryMilestones.filter(m => m.isFirst);

      return {
        countryId,
        countryName: COUNTRY_NAMES[countryId as string] || countryId.toString(),
        milestones: countryMilestones,
        firstAchievements,
        totalMilestones: countryMilestones.length,
        totalFirsts: firstAchievements.length,
        earliestMilestone: countryMilestones[0],
        latestMilestone: countryMilestones[countryMilestones.length - 1]
      };
    }
  }

  async compareTimelines(countryIds: (string | number)[]): Promise<TimelineComparison> {
    try {
      const response = await this.axiosInstance.post<TimelineComparison>('/milestones/compare-timelines', {
        countryIds
      });
      return response.data;
    } catch (error) {
      // Fallback to local calculation
      const countryTimelines = await Promise.all(countryIds.map(id => this.getCountryTimeline(id)));
      const allMilestones = await this.getAll();

      const milestoneTypes = new Set(allMilestones.map(m => m.milestoneType));
      const sharedMilestones: TimelineComparison['sharedMilestones'] = [];

      milestoneTypes.forEach(type => {
        const achievements = allMilestones
          .filter(m => m.milestoneType === type && countryIds.includes(m.countryId))
          .map(m => ({
            countryId: m.countryId,
            date: m.dateAchieved,
            rank: m.globalRank
          }))
          .sort((a, b) => a.rank - b.rank);

        if (achievements.length > 0) {
          sharedMilestones.push({
            milestoneType: type,
            achievements
          });
        }
      });

      return {
        countries: countryTimelines,
        sharedMilestones
      };
    }
  }

  // ============================================================================
  // SEARCH & STATISTICS
  // ============================================================================

  async search(query: string): Promise<SpaceMilestone[]> {
    try {
      const response = await this.axiosInstance.get<SpaceMilestone[]>('/milestones/search', {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      const lowerQuery = query.toLowerCase();
      const all = await this.getAll();
      return all.filter(m =>
        m.title.toLowerCase().includes(lowerQuery) ||
        m.description.toLowerCase().includes(lowerQuery) ||
        (m.achievedBy && m.achievedBy.toLowerCase().includes(lowerQuery))
      );
    }
  }

  // Legacy method name
  searchMilestones(query: string): Promise<SpaceMilestone[]> {
    return this.search(query);
  }

  async getStatistics(): Promise<GlobalMilestoneStats> {
    try {
      const response = await this.axiosInstance.get<GlobalMilestoneStats>('/milestones/statistics');
      return response.data;
    } catch (error) {
      return this.getGlobalStats();
    }
  }

  async getGlobalStats(): Promise<GlobalMilestoneStats> {
    const milestones = await this.getAll();
    const allTypes = Object.keys(MILESTONE_TYPE_INFO) as MilestoneType[];
    const achievedTypes = new Set(milestones.map(m => m.milestoneType));
    const unachievedTypes = allTypes.filter(t => !achievedTypes.has(t));

    const categoryCount: Record<MilestoneCategory, number> = {
      orbital: 0, lunar: 0, planetary: 0, technology: 0, human: 0, other: 0
    };
    milestones.forEach(m => { categoryCount[m.category]++; });

    const countryMap = new Map<string | number, { count: number; firstsCount: number }>();
    milestones.forEach(m => {
      const current = countryMap.get(m.countryId) || { count: 0, firstsCount: 0 };
      current.count++;
      if (m.isFirst) current.firstsCount++;
      countryMap.set(m.countryId, current);
    });

    const decadeCount = new Map<string, number>();
    milestones.forEach(m => {
      const decade = `${Math.floor(m.year / 10) * 10}s`;
      decadeCount.set(decade, (decadeCount.get(decade) || 0) + 1);
    });

    const sortedByDate = this.sortByDate(milestones, true);

    return {
      totalMilestones: milestones.length,
      totalMilestoneTypes: allTypes.length,
      achievedMilestoneTypes: achievedTypes.size,
      unachievedMilestoneTypes: unachievedTypes,
      milestonesByCategory: Object.entries(categoryCount).map(([category, count]) => ({
        category: category as MilestoneCategory,
        count
      })),
      milestonesByCountry: Array.from(countryMap.entries()).map(([countryId, data]) => ({
        countryId,
        countryName: COUNTRY_NAMES[countryId as string] || countryId.toString(),
        count: data.count,
        firstsCount: data.firstsCount
      })).sort((a, b) => b.firstsCount - a.firstsCount),
      milestonesByDecade: Array.from(decadeCount.entries())
        .map(([decade, count]) => ({ decade, count }))
        .sort((a, b) => a.decade.localeCompare(b.decade)),
      mostRecentMilestone: sortedByDate[0],
      upcomingMilestones: unachievedTypes.slice(0, 5)
    };
  }

  // ============================================================================
  // COUNTS
  // ============================================================================

  async getCountsByCountry(): Promise<Array<{ countryId: string; count: number }>> {
    try {
      const response = await this.axiosInstance.get('/milestones/counts/by-country');
      return response.data;
    } catch (error) {
      const stats = await this.getStatistics();
      return stats.milestonesByCountry.map(c => ({ countryId: String(c.countryId), count: c.count }));
    }
  }

  async getCountsByType(): Promise<Array<{ type: string; count: number }>> {
    try {
      const response = await this.axiosInstance.get('/milestones/counts/by-type');
      return response.data;
    } catch (error) {
      const all = await this.getAll();
      const typeMap = new Map<string, number>();
      all.forEach(m => typeMap.set(m.milestoneType, (typeMap.get(m.milestoneType) || 0) + 1));
      return Array.from(typeMap.entries()).map(([type, count]) => ({ type, count }));
    }
  }

  async getCountsByCategory(): Promise<Array<{ category: string; count: number }>> {
    try {
      const response = await this.axiosInstance.get('/milestones/counts/by-category');
      return response.data;
    } catch (error) {
      const stats = await this.getStatistics();
      return stats.milestonesByCategory.map(c => ({ category: c.category, count: c.count }));
    }
  }

  async getCountsByDecade(): Promise<Array<{ decade: string; count: number }>> {
    try {
      const response = await this.axiosInstance.get('/milestones/counts/by-decade');
      return response.data;
    } catch (error) {
      const stats = await this.getStatistics();
      return stats.milestonesByDecade;
    }
  }

  // ============================================================================
  // METADATA
  // ============================================================================

  async getTypes(): Promise<string[]> {
    try {
      const response = await this.axiosInstance.get<string[]>('/milestones/types');
      return response.data;
    } catch (error) {
      return Object.keys(MILESTONE_TYPE_INFO);
    }
  }

  async getCategories(): Promise<string[]> {
    try {
      const response = await this.axiosInstance.get<string[]>('/milestones/categories');
      return response.data;
    } catch (error) {
      return ['orbital', 'lunar', 'planetary', 'technology', 'human', 'other'];
    }
  }

  async getSignificanceLevels(): Promise<string[]> {
    try {
      const response = await this.axiosInstance.get<string[]>('/milestones/significance-levels');
      return response.data;
    } catch (error) {
      return ['major', 'significant', 'notable'];
    }
  }

  async getYears(): Promise<number[]> {
    try {
      const response = await this.axiosInstance.get<number[]>('/milestones/years');
      return response.data;
    } catch (error) {
      const all = await this.getAll();
      const years = new Set(all.map(m => m.year));
      return Array.from(years).sort((a, b) => a - b);
    }
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  getMilestoneTypeInfo(type: MilestoneType): (typeof MILESTONE_TYPE_INFO)[MilestoneType] {
    return MILESTONE_TYPE_INFO[type];
  }

  getAllMilestoneTypeInfos() {
    return MILESTONE_TYPE_INFO;
  }
}

// Export singleton instance
export const spaceMilestoneService = new SpaceMilestoneService();
export default spaceMilestoneService;
