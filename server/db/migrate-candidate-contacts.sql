-- Add contact columns: address, mobile, home_ward
-- (email and phone already exist from v2 migration)
ALTER TABLE candidates ADD COLUMN address TEXT NOT NULL DEFAULT '';
ALTER TABLE candidates ADD COLUMN mobile TEXT NOT NULL DEFAULT '';
ALTER TABLE candidates ADD COLUMN home_ward TEXT NOT NULL DEFAULT '';

-- Populate contact data for all 17 candidates (matched by ward)
UPDATE candidates SET email = 'alancrystall@hotmail.co.uk', phone = '01702474047', mobile = '07790205184', address = '16 Cliff Parade, Leigh-on-Sea SS9 1AS', home_ward = 'Leigh' WHERE ward = 'Belfairs';
UPDATE candidates SET email = 'andywilkins99@gmail.com', phone = '', mobile = '07714631249', address = '22 Sydney Road, Leigh-on-Sea SS9 3P', home_ward = 'West Leigh' WHERE ward = 'Blenheim Park';
UPDATE candidates SET email = 'cavhind@gmail.com', phone = '', mobile = '07870658505', address = '22 Leigh Road, Leigh-on-Sea SS9 1LD', home_ward = 'Chalkwell' WHERE ward = 'Chalkwell';
UPDATE candidates SET email = 'robmcmullan99@aol.com', phone = '01702471062', mobile = '07968802505', address = '60 Western Road, Leigh-on-Sea SS9 2PW', home_ward = 'West Leigh' WHERE ward = 'Eastwood Park';
UPDATE candidates SET email = 'billy3116@yahoo.co.uk', phone = '01702340852', mobile = '07813914168', address = '7 Arundel Gardens, Westcliff-on-Sea SS0 0BL', home_ward = 'Prittlewell' WHERE ward = 'Kursaal';
UPDATE candidates SET email = 'carole.mulroney@btinternet.com', phone = '01702475117', mobile = '07766754073', address = '83 Southsea Avenue, Leigh-on-Sea SS9 2BH', home_ward = 'Leigh' WHERE ward = 'Leigh';
UPDATE candidates SET email = 'howes01702@outlook.com', phone = '01702341047', mobile = '07913433752', address = '91 Brightwell Avenue, Westcliff-on-Sea SS0 9EG', home_ward = 'Westborough' WHERE ward = 'Milton';
UPDATE candidates SET email = 'davebarrettba@gmail.com', phone = '01702298630', mobile = '07867975601', address = '55 Richmond Avenue, Southend-on-Sea SS3 9LE', home_ward = 'West Shoebury' WHERE ward = 'Prittlewell';
UPDATE candidates SET email = 'knujsti0@gmail.com', phone = '', mobile = '07388128900', address = '20 St. Andrew''s Road, Southend-on-Sea SS3 9HX', home_ward = 'West Shoebury' WHERE ward = 'Shoeburyness';
UPDATE candidates SET email = 'michael.trace@virginmedia.com', phone = '01702337942', mobile = '07505895339', address = '34 North Crescent, Southend-on-Sea SS2 6TJ', home_ward = 'St Laurence' WHERE ward = 'Southchurch';
UPDATE candidates SET email = 'kev_malone@hotmail.com', phone = '', mobile = '07986804354', address = '67 Whitehouse Road, Leigh-on-Sea SS9 5SR', home_ward = 'Eastwood Park' WHERE ward = 'St Laurence';
UPDATE candidates SET email = 'janemtravers@gmail.com', phone = '', mobile = '07948210201', address = '379 Victoria Avenue, Southend-on-Sea SS2 6NJ', home_ward = 'Prittlewell' WHERE ward = 'St Luke''s';
UPDATE candidates SET email = 'katiekurilecz@gmail.com', phone = '', mobile = '07702202309', address = '2 Hermitage Road, Westcliff-on-Sea SS0 7NQ', home_ward = 'Milton' WHERE ward = 'Thorpe';
UPDATE candidates SET email = 'phil_edey@hotmail.com', phone = '01702329836', mobile = '07960077495', address = '17 Ramuz Drive, Westcliff-on-Sea SS0 9JA', home_ward = 'Westborough' WHERE ward = 'Victoria';
UPDATE candidates SET email = 'stephencummins@gmail.com', phone = '', mobile = '07388129800', address = '379 Victoria Avenue, Southend-on-Sea SS2 6NJ', home_ward = 'Prittlewell' WHERE ward = 'West Leigh';
UPDATE candidates SET email = 'john0202blue@gmail.com', phone = '01702345076', mobile = '07753803934', address = '20 Ceylon Road, Westcliff-on-Sea SS0 7HP', home_ward = 'Milton' WHERE ward = 'West Shoebury';
UPDATE candidates SET email = 'suzysabroad@hotmail.com', phone = '01702329836', mobile = '07896503298', address = '17 Ramuz Drive, Westcliff-on-Sea SS0 9JA', home_ward = 'Westborough' WHERE ward = 'Westborough';
