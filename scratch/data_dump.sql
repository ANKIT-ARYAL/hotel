--
-- PostgreSQL database dump
--

\restrict XyUZfzU0iQ4vugU4j3N0mJAgB8nq5UuR1of73TsGsPBB1g0APhqhzz7zn8TxQTm

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: Amenity; Type: TABLE DATA; Schema: public; Owner: -
--

SET SESSION AUTHORIZATION DEFAULT;

ALTER TABLE public."Amenity" DISABLE TRIGGER ALL;

COPY public."Amenity" (id, name, icon, "createdAt") FROM stdin;
a1cff829-e054-4095-bf48-86c68ad2fc09	AC	wind	2026-09-13 01:51:37.686
2db92823-611b-46b6-8cfe-54b514120e04	Free WiFi	wifi	2026-09-13 01:51:37.691
42ea5823-3f10-4df1-b47e-d7ac11c0c670	TV	tv	2026-09-13 01:51:37.695
b2a75d76-958c-4682-9600-a8d0719e6817	Breakfast Included	utensils	2026-09-13 01:51:37.699
38f6c47f-d7ad-4386-946c-781c1e21f0e2	Geyser	bath	2026-09-13 01:51:37.702
8ea02106-041e-42ea-a653-b30c3e88fea5	Parking	car	2026-09-13 01:51:37.706
c4a80a88-670b-4596-8715-ceb9af8f2d63	Gym	dumbbell	2026-09-17 13:48:25.345
9341167a-3e96-4657-bcc4-34ecbd38c3a6	test	coffee	2026-09-20 02:23:12.047
\.


ALTER TABLE public."Amenity" ENABLE TRIGGER ALL;

--
-- Data for Name: AnalyticsEvent; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public."AnalyticsEvent" DISABLE TRIGGER ALL;

COPY public."AnalyticsEvent" (id, name, category, value, date, "createdAt") FROM stdin;
1dd8be58-a2d8-40bc-88b6-e53f8bd96a4b	Dashboard View	CONVERSION	45	2026-09-02 01:51:37.855	2026-09-13 01:51:37.856
b1acab64-715d-4a77-9c98-4e0cfed49650	Room Search	PAGE_VIEW	41	2026-09-12 01:51:37.856	2026-09-13 01:51:37.856
1a6b5cb2-e356-447b-bee9-8c80152642cc	Room Search	PAGE_VIEW	85	2026-09-10 01:51:37.857	2026-09-13 01:51:37.857
e74659fc-306a-481a-b958-a9ec5c56899b	Room Search	PAGE_VIEW	38	2026-08-19 01:51:37.857	2026-09-13 01:51:37.858
c9a578d7-07ed-4b95-9f12-7b50a9c995b3	Room Search	BOOKING_ATTEMPT	82	2026-08-25 01:51:37.858	2026-09-13 01:51:37.858
5d4d6224-5cd1-49ca-aa0c-af15c48002fd	Room Search	BOOKING_ATTEMPT	22	2026-08-24 01:51:37.858	2026-09-13 01:51:37.859
34820ac1-7531-486b-a760-8afb5cf80b2b	Dashboard View	PAGE_VIEW	90	2026-08-15 01:51:37.859	2026-09-13 01:51:37.859
22e7805a-86d6-4923-9fc0-c4be595f7e93	Dashboard View	PAGE_VIEW	9	2026-09-03 01:51:37.859	2026-09-13 01:51:37.86
3f79a2ce-4fb0-4540-aa37-d3ea811aa211	Checkout Started	PAGE_VIEW	60	2026-09-05 01:51:37.86	2026-09-13 01:51:37.86
e8913724-ff48-422d-aeff-98c2ed518469	Room Search	BOOKING_ATTEMPT	90	2026-09-12 01:51:37.86	2026-09-13 01:51:37.861
4e601a6c-7bc7-42dc-93be-18cd383fe188	Dashboard View	PAGE_VIEW	55	2026-09-05 01:51:37.861	2026-09-13 01:51:37.862
587f88b9-b8de-4a13-8bc6-9caacb53a208	Checkout Started	BOOKING_ATTEMPT	99	2026-08-29 01:51:37.862	2026-09-13 01:51:37.863
5f52cfa7-5016-4e16-a6b4-30f213c8c521	Dashboard View	PAGE_VIEW	18	2026-09-12 01:51:37.863	2026-09-13 01:51:37.863
de860c55-bfc8-4633-ad50-2eba946e8616	Room Search	PAGE_VIEW	83	2026-08-26 01:51:37.863	2026-09-13 01:51:37.864
1ac7a7c7-e334-439d-be17-b986208ecff6	Dashboard View	PAGE_VIEW	14	2026-08-31 01:51:37.864	2026-09-13 01:51:37.865
c2e08d68-94e7-462a-a748-c607d4e3d138	Room Search	PAGE_VIEW	99	2026-08-19 01:51:37.865	2026-09-13 01:51:37.865
96ecd764-6b08-4e98-adcb-8393ab504dc1	Room Search	PAGE_VIEW	49	2026-09-07 01:51:37.865	2026-09-13 01:51:37.866
2e641de3-d2a9-42bc-a331-7d673dace151	Dashboard View	BOOKING_ATTEMPT	64	2026-08-28 01:51:37.866	2026-09-13 01:51:37.867
7c2987af-dd11-483d-ab07-cf6cbf603d88	Checkout Started	CONVERSION	4	2026-09-11 01:51:37.866	2026-09-13 01:51:37.867
99988d64-3822-4048-8f7a-ea845651e6b5	Room Search	PAGE_VIEW	93	2026-09-02 01:51:37.867	2026-09-13 01:51:37.868
\.


ALTER TABLE public."AnalyticsEvent" ENABLE TRIGGER ALL;

--
-- Data for Name: Guest; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public."Guest" DISABLE TRIGGER ALL;

COPY public."Guest" (id, name, email, phone, "createdAt", "updatedAt") FROM stdin;
94a1d371-89bd-4efb-a3bb-55df4ca4ca0f	John Doe	john@example.com	123-456-7890	2026-09-13 01:51:37.798	2026-09-13 01:51:37.798
b8cbde8e-e669-411d-b6fe-8870ae5011f2	Jane Smith	jane@example.com	234-567-8901	2026-09-13 01:51:37.803	2026-09-13 01:51:37.803
11a2cf51-aee8-468c-a019-e0c91626794b	Robert Johnson	robert@example.com	345-678-9012	2026-09-13 01:51:37.805	2026-09-13 01:51:37.805
01e37ca0-a71d-4120-8f37-a5ef6ad7dca4	qeasd	asd@as.com	123123123	2026-09-16 10:10:25.467	2026-09-16 10:10:25.467
82ae4425-fca9-4c7e-8181-93af484c84c9	test	test@test.com	1234567890	2026-09-16 10:19:13.439	2026-09-16 10:19:13.439
9964e66a-81f5-4f0a-bece-738b9c352580	TEST	test@abc.com	1234567809	2026-09-16 12:42:50.551	2026-09-16 12:42:50.551
\.


ALTER TABLE public."Guest" ENABLE TRIGGER ALL;

--
-- Data for Name: RoomCategory; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public."RoomCategory" DISABLE TRIGGER ALL;

COPY public."RoomCategory" (id, name, description, "basePrice", "createdAt", "updatedAt", "bedType", occupancy, size, slug) FROM stdin;
da6737ae-e291-4bd1-9f4f-09ab67689ce7	Standard Room	Experience the perfect blend of modern comfort and timeless elegance in our Standard Room. Designed with the discerning traveler in mind, this sanctuary offers a peaceful retreat from the bustling city. The space is thoughtfully appointed with bespoke furnishings, a plush king-sized bed wrapped in high-thread-count Egyptian cotton linens, and ambient lighting that creates a warm, inviting atmosphere. \n        \nThe en-suite bathroom features a rainfall shower and premium organic bath amenities, ensuring your daily routines feel like a spa experience. Whether you're visiting for business or leisure, the Standard Room provides all the essential luxuries, including high-speed Wi-Fi, a state-of-the-art smart TV, and a dedicated workspace. Discover a haven where every detail has been curated to guarantee an exceptional stay.	100	2026-09-13 01:51:37.71	2026-09-18 03:21:55.612	\N	4	\N	standard-room
da0c49b6-4682-4957-bcf4-c7bd9e004369	Premium Room	Elevate your stay in our Premium Room, a meticulously crafted space that strikes a harmonious balance between contemporary design and ultimate relaxation. Located on our higher floors, these rooms feature expansive floor-to-ceiling windows that bathe the interior in natural light and offer sweeping views of the city skyline. Unwind in the spacious sitting area, complete with designer lounge seating, or retreat to the oversized king bed dressed in 600-thread-count Egyptian cotton. The spa-inspired marble bathroom boasts a deep soaking tub and a separate glass-enclosed dual rainfall shower, providing a private sanctuary to recharge after a day of exploration or business.	150	2026-09-13 01:51:37.725	2026-09-18 03:21:55.612	\N	4	\N	premium-room
9b4f5419-201a-4ea3-a5e9-db7d23d07645	Townhouse	Experience the rare privilege of residential-style luxury in our exclusive Townhouse suites. Designed to feel like your own private estate within the hotel, this magnificent multi-level accommodation offers an unparalleled sense of space and seclusion. The main floor features an elegant, open-concept living and dining area perfect for entertaining, a fully equipped wet bar, and a private landscaped terrace. Ascend the sculptural staircase to discover a master bedroom retreat, complete with a bespoke walk-in wardrobe and a palatial en-suite bathroom featuring rare stone finishes. With dedicated 24-hour butler service and priority VIP amenities, the Townhouse is a sophisticated home away from home.	200	2026-09-13 01:51:37.73	2026-09-18 03:21:55.612	\N	4	\N	townhouse
0d16c0ab-d3db-42dd-9728-e28b0640febf	Flagship	The Flagship is our crowning jewel—an architectural masterpiece designed for the most discerning global traveler. Spanning a breathtaking footprint, this palatial suite represents the absolute pinnacle of our brand's luxury philosophy. It seamlessly integrates a grand reception foyer, a formal dining room seating twelve, a private study, and a state-of-the-art media room. Every detail, from the curated gallery of original artwork to the custom-commissioned furnishings, exudes uncompromising prestige. Step out onto the wrap-around panoramic balcony to take in unobstructed 360-degree views, or relax in your private in-suite wellness room. This is not just a room; it is an unforgettable, majestic experience reserved for our most elite guests.	250	2026-09-13 01:51:37.734	2026-09-18 03:21:55.612	\N	4	\N	flagship
54dfde7a-df31-4762-83ad-94bc36cb9b10	test	test categopry	999	2026-09-20 02:22:54.813	2026-09-20 02:22:54.813	\N	\N	\N	test
\.


ALTER TABLE public."RoomCategory" ENABLE TRIGGER ALL;

--
-- Data for Name: Room; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public."Room" DISABLE TRIGGER ALL;

COPY public."Room" (id, number, "categoryId", status, price, description, "createdAt", "updatedAt", image, "videoUrl", name) FROM stdin;
7ef6e3cf-f0e1-491d-ae24-6c8a5b21873f	101	0d16c0ab-d3db-42dd-9728-e28b0640febf	AVAILABLE	260	Experience the pristine comfort of Room 101, located in a highly sought-after, tranquil corridor of the hotel. This room features customized acoustic insulation and an incredibly serene atmosphere, guaranteeing the most restful night's sleep imaginable.	2026-09-13 01:51:37.739	2026-09-16 06:31:44.972	\N	\N	\N
d85169dd-bb0b-4209-a7e5-0a9085309d29	102	0d16c0ab-d3db-42dd-9728-e28b0640febf	AVAILABLE	250	Room 102 offers a uniquely positioned vantage point, capturing stunning morning light that perfectly illuminates the carefully curated artwork adorning the walls. Enjoy the whisper-quiet ambiance and unparalleled privacy this specific unit affords.	2026-09-13 01:51:37.745	2026-09-16 06:31:44.976	\N	\N	\N
728e9f6c-8bd9-4fba-a51b-b3887ccba647	103	da6737ae-e291-4bd1-9f4f-09ab67689ce7	OCCUPIED	110	Distinguished by its slightly expanded floor plan, Room 103 provides extra lounging space and features an exclusive reading nook by the window. The subtle, bespoke interior accents make this particular room a favorite among our returning guests.	2026-09-13 01:51:37.749	2026-09-16 06:31:44.978	\N	\N	\N
280ae7da-b8b0-4f10-8db1-71c0f50625f5	104	da0c49b6-4682-4957-bcf4-c7bd9e004369	AVAILABLE	150	Experience the pristine comfort of Room 104, located in a highly sought-after, tranquil corridor of the hotel. This room features customized acoustic insulation and an incredibly serene atmosphere, guaranteeing the most restful night's sleep imaginable.	2026-09-13 01:51:37.752	2026-09-16 06:31:44.98	\N	\N	\N
43d3b559-0400-4ec0-9177-38db49c8de97	105	0d16c0ab-d3db-42dd-9728-e28b0640febf	AVAILABLE	260	Room 105 offers a uniquely positioned vantage point, capturing stunning morning light that perfectly illuminates the carefully curated artwork adorning the walls. Enjoy the whisper-quiet ambiance and unparalleled privacy this specific unit affords.	2026-09-13 01:51:37.755	2026-09-16 06:31:44.983	\N	\N	\N
e4932cf4-5e2c-42d0-8faf-c89ec7b17fdf	106	0d16c0ab-d3db-42dd-9728-e28b0640febf	AVAILABLE	260	Distinguished by its slightly expanded floor plan, Room 106 provides extra lounging space and features an exclusive reading nook by the window. The subtle, bespoke interior accents make this particular room a favorite among our returning guests.	2026-09-13 01:51:37.758	2026-09-16 06:31:44.985	\N	\N	\N
bd029648-0ea6-43dd-8169-fd48b3860eee	107	0d16c0ab-d3db-42dd-9728-e28b0640febf	AVAILABLE	260	Experience the pristine comfort of Room 107, located in a highly sought-after, tranquil corridor of the hotel. This room features customized acoustic insulation and an incredibly serene atmosphere, guaranteeing the most restful night's sleep imaginable.	2026-09-13 01:51:37.761	2026-09-16 06:31:44.987	\N	\N	\N
d6784782-75e0-46d5-af05-49364e8b9737	108	9b4f5419-201a-4ea3-a5e9-db7d23d07645	CLEANING	210	Room 108 offers a uniquely positioned vantage point, capturing stunning morning light that perfectly illuminates the carefully curated artwork adorning the walls. Enjoy the whisper-quiet ambiance and unparalleled privacy this specific unit affords.	2026-09-13 01:51:37.764	2026-09-16 06:31:44.991	\N	\N	\N
ed89bf87-7e6a-4197-8960-87221a555973	109	da0c49b6-4682-4957-bcf4-c7bd9e004369	OCCUPIED	150	Distinguished by its slightly expanded floor plan, Room 109 provides extra lounging space and features an exclusive reading nook by the window. The subtle, bespoke interior accents make this particular room a favorite among our returning guests.	2026-09-13 01:51:37.767	2026-09-16 06:31:44.993	\N	\N	\N
22a8df10-de6c-4852-84d1-357dd7f1f29d	110	da0c49b6-4682-4957-bcf4-c7bd9e004369	AVAILABLE	160	Experience the pristine comfort of Room 110, located in a highly sought-after, tranquil corridor of the hotel. This room features customized acoustic insulation and an incredibly serene atmosphere, guaranteeing the most restful night's sleep imaginable.	2026-09-13 01:51:37.769	2026-09-16 06:31:44.993	\N	\N	\N
ddecc379-9ae4-4c0f-90a0-0f73d3e181e3	111	da6737ae-e291-4bd1-9f4f-09ab67689ce7	OCCUPIED	100	Room 111 offers a uniquely positioned vantage point, capturing stunning morning light that perfectly illuminates the carefully curated artwork adorning the walls. Enjoy the whisper-quiet ambiance and unparalleled privacy this specific unit affords.	2026-09-13 01:51:37.771	2026-09-16 06:31:44.994	\N	\N	\N
1dd44a1e-a18b-4085-849b-28e55e47dd66	112	da6737ae-e291-4bd1-9f4f-09ab67689ce7	AVAILABLE	100	Distinguished by its slightly expanded floor plan, Room 112 provides extra lounging space and features an exclusive reading nook by the window. The subtle, bespoke interior accents make this particular room a favorite among our returning guests.	2026-09-13 01:51:37.773	2026-09-16 06:31:44.995	\N	\N	\N
ddb533f6-0d1d-4e76-ab0e-5c128410b449	113	da6737ae-e291-4bd1-9f4f-09ab67689ce7	CLEANING	110	Experience the pristine comfort of Room 113, located in a highly sought-after, tranquil corridor of the hotel. This room features customized acoustic insulation and an incredibly serene atmosphere, guaranteeing the most restful night's sleep imaginable.	2026-09-13 01:51:37.779	2026-09-16 06:31:44.996	\N	\N	\N
743d7e89-ae76-4b90-aa87-92273177b07d	114	da6737ae-e291-4bd1-9f4f-09ab67689ce7	MAINTENANCE	100	Room 114 offers a uniquely positioned vantage point, capturing stunning morning light that perfectly illuminates the carefully curated artwork adorning the walls. Enjoy the whisper-quiet ambiance and unparalleled privacy this specific unit affords.	2026-09-13 01:51:37.781	2026-09-16 06:31:44.996	\N	\N	\N
b361641d-e675-455b-9976-0c1b57ddb679	115	da0c49b6-4682-4957-bcf4-c7bd9e004369	OCCUPIED	160	Distinguished by its slightly expanded floor plan, Room 115 provides extra lounging space and features an exclusive reading nook by the window. The subtle, bespoke interior accents make this particular room a favorite among our returning guests.	2026-09-13 01:51:37.783	2026-09-16 06:31:44.998	\N	\N	\N
de145cbb-9fff-408c-b4b4-6b37f7f4b163	116	0d16c0ab-d3db-42dd-9728-e28b0640febf	OCCUPIED	260	Experience the pristine comfort of Room 116, located in a highly sought-after, tranquil corridor of the hotel. This room features customized acoustic insulation and an incredibly serene atmosphere, guaranteeing the most restful night's sleep imaginable.	2026-09-13 01:51:37.786	2026-09-16 06:31:44.999	\N	\N	\N
a46baba5-a730-43a4-914d-a3ffbec63cf5	117	da6737ae-e291-4bd1-9f4f-09ab67689ce7	MAINTENANCE	110	Room 117 offers a uniquely positioned vantage point, capturing stunning morning light that perfectly illuminates the carefully curated artwork adorning the walls. Enjoy the whisper-quiet ambiance and unparalleled privacy this specific unit affords.	2026-09-13 01:51:37.788	2026-09-16 06:31:45.001	\N	\N	\N
29bf8b63-e8a6-476a-a19e-f0b3b746eab7	118	0d16c0ab-d3db-42dd-9728-e28b0640febf	MAINTENANCE	260	Distinguished by its slightly expanded floor plan, Room 118 provides extra lounging space and features an exclusive reading nook by the window. The subtle, bespoke interior accents make this particular room a favorite among our returning guests.	2026-09-13 01:51:37.79	2026-09-16 06:31:45.002	\N	\N	\N
2a68483f-ffc1-4ea2-8a8d-474b4fe01864	119	0d16c0ab-d3db-42dd-9728-e28b0640febf	CLEANING	250	Experience the pristine comfort of Room 119, located in a highly sought-after, tranquil corridor of the hotel. This room features customized acoustic insulation and an incredibly serene atmosphere, guaranteeing the most restful night's sleep imaginable.	2026-09-13 01:51:37.793	2026-09-16 06:31:45.003	\N	\N	\N
03a3c120-19cf-4d65-ba24-82f3d328a294	120	da6737ae-e291-4bd1-9f4f-09ab67689ce7	AVAILABLE	100	Room 120 offers a uniquely positioned vantage point, capturing stunning morning light that perfectly illuminates the carefully curated artwork adorning the walls. Enjoy the whisper-quiet ambiance and unparalleled privacy this specific unit affords.	2026-09-13 01:51:37.796	2026-09-16 06:31:45.004	\N	\N	\N
\.


ALTER TABLE public."Room" ENABLE TRIGGER ALL;

--
-- Data for Name: Booking; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public."Booking" DISABLE TRIGGER ALL;

COPY public."Booking" (id, "guestId", "checkIn", "checkOut", "totalAmount", status, "roomId", "createdAt", "updatedAt", "paymentAmount", "paymentMethod", "paymentRefId", "isRead") FROM stdin;
5666384c-082f-4805-9477-93d5fd6ea9a9	b8cbde8e-e669-411d-b6fe-8870ae5011f2	2026-08-24 01:51:37.814	2026-08-29 01:51:37.814	1250	CHECKED_OUT	d85169dd-bb0b-4209-a7e5-0a9085309d29	2026-09-13 01:51:37.815	2026-09-13 01:51:37.815	\N	\N	\N	f
61a472db-322a-404f-8b7a-98d32bf4c41a	11a2cf51-aee8-468c-a019-e0c91626794b	2026-09-26 01:51:37.819	2026-10-01 01:51:37.819	750	CONFIRMED	280ae7da-b8b0-4f10-8db1-71c0f50625f5	2026-09-13 01:51:37.82	2026-09-13 01:51:37.82	\N	\N	\N	f
dbe3fc9a-c040-4dbc-b9d9-f9b44d44af79	94a1d371-89bd-4efb-a3bb-55df4ca4ca0f	2026-08-24 01:51:37.821	2026-08-26 01:51:37.821	300	CHECKED_OUT	ed89bf87-7e6a-4197-8960-87221a555973	2026-09-13 01:51:37.822	2026-09-13 01:51:37.822	\N	\N	\N	f
725b2fc1-1924-41e3-b524-25c6f2e3ed2c	b8cbde8e-e669-411d-b6fe-8870ae5011f2	2026-09-01 01:51:37.824	2026-09-02 01:51:37.824	210	CHECKED_OUT	d6784782-75e0-46d5-af05-49364e8b9737	2026-09-13 01:51:37.825	2026-09-13 01:51:37.825	\N	\N	\N	f
eee09c33-3ca2-4a76-8694-f4ef9bf51e33	94a1d371-89bd-4efb-a3bb-55df4ca4ca0f	2026-09-06 01:51:37.829	2026-09-07 01:51:37.829	100	CHECKED_OUT	743d7e89-ae76-4b90-aa87-92273177b07d	2026-09-13 01:51:37.829	2026-09-13 01:51:37.829	\N	\N	\N	f
66965a6d-8951-4f4b-808d-cb42d993b7aa	b8cbde8e-e669-411d-b6fe-8870ae5011f2	2026-09-19 01:51:37.831	2026-09-22 01:51:37.831	750	CONFIRMED	2a68483f-ffc1-4ea2-8a8d-474b4fe01864	2026-09-13 01:51:37.832	2026-09-13 01:51:37.832	\N	\N	\N	f
e36da4e2-f0dc-4d54-8d25-791373c52777	11a2cf51-aee8-468c-a019-e0c91626794b	2026-09-24 01:51:37.832	2026-09-27 01:51:37.832	630	CONFIRMED	d6784782-75e0-46d5-af05-49364e8b9737	2026-09-13 01:51:37.833	2026-09-13 01:51:37.833	\N	\N	\N	f
979809de-7f0c-4e2d-9523-9c916cbaa6fb	b8cbde8e-e669-411d-b6fe-8870ae5011f2	2026-09-22 01:51:37.833	2026-09-27 01:51:37.833	1300	CONFIRMED	e4932cf4-5e2c-42d0-8faf-c89ec7b17fdf	2026-09-13 01:51:37.834	2026-09-13 01:51:37.834	\N	\N	\N	f
75c13500-4e0a-44bf-93ca-983e0b2f240c	94a1d371-89bd-4efb-a3bb-55df4ca4ca0f	2026-09-26 01:51:37.834	2026-09-27 01:51:37.834	160	CONFIRMED	22a8df10-de6c-4852-84d1-357dd7f1f29d	2026-09-13 01:51:37.835	2026-09-13 01:51:37.835	\N	\N	\N	f
9c559f33-1383-4ba1-8cf7-6cd923d055e0	b8cbde8e-e669-411d-b6fe-8870ae5011f2	2026-09-24 01:51:37.835	2026-09-29 01:51:37.835	800	CONFIRMED	b361641d-e675-455b-9976-0c1b57ddb679	2026-09-13 01:51:37.836	2026-09-13 01:51:37.836	\N	\N	\N	f
30755379-7fd1-49a2-a036-cb5a0452ad29	11a2cf51-aee8-468c-a019-e0c91626794b	2026-09-23 01:51:37.837	2026-09-24 01:51:37.837	260	CONFIRMED	29bf8b63-e8a6-476a-a19e-f0b3b746eab7	2026-09-13 01:51:37.838	2026-09-13 01:51:37.838	\N	\N	\N	f
169c3405-46fd-4ebd-bc55-de05379dc428	94a1d371-89bd-4efb-a3bb-55df4ca4ca0f	2026-08-25 01:51:37.839	2026-08-30 01:51:37.839	550	CHECKED_OUT	728e9f6c-8bd9-4fba-a51b-b3887ccba647	2026-09-13 01:51:37.839	2026-09-13 01:51:37.839	\N	\N	\N	f
9c5c5eaa-2a45-4751-b56f-ba7c2c8702ed	11a2cf51-aee8-468c-a019-e0c91626794b	2026-09-29 01:51:37.84	2026-10-01 01:51:37.84	500	CONFIRMED	2a68483f-ffc1-4ea2-8a8d-474b4fe01864	2026-09-13 01:51:37.841	2026-09-13 01:51:37.841	\N	\N	\N	f
9e1ca556-76db-42b4-83ea-4929cb88839a	11a2cf51-aee8-468c-a019-e0c91626794b	2026-09-07 01:51:37.842	2026-09-11 01:51:37.842	1040	CHECKED_OUT	43d3b559-0400-4ec0-9177-38db49c8de97	2026-09-13 01:51:37.842	2026-09-13 01:51:37.842	\N	\N	\N	f
c7ee6362-d70d-477f-9b45-20a8898a7c83	b8cbde8e-e669-411d-b6fe-8870ae5011f2	2026-08-30 01:51:37.844	2026-09-03 01:51:37.844	400	CHECKED_OUT	03a3c120-19cf-4d65-ba24-82f3d328a294	2026-09-13 01:51:37.844	2026-09-13 01:51:37.844	\N	\N	\N	f
ebd03c94-a2a7-45c8-a732-e6f7ef47df78	94a1d371-89bd-4efb-a3bb-55df4ca4ca0f	2026-09-13 01:51:37.845	2026-09-16 01:51:37.845	780	CHECKED_IN	7ef6e3cf-f0e1-491d-ae24-6c8a5b21873f	2026-09-13 01:51:37.846	2026-09-13 01:51:37.846	\N	\N	\N	f
f08f91e1-a89e-4903-ba22-e9dadf215388	b8cbde8e-e669-411d-b6fe-8870ae5011f2	2026-09-08 01:51:37.847	2026-09-11 01:51:37.847	750	CHECKED_OUT	2a68483f-ffc1-4ea2-8a8d-474b4fe01864	2026-09-13 01:51:37.848	2026-09-13 01:51:37.848	\N	\N	\N	f
009b051d-3a39-48bf-9b15-7355037193c7	11a2cf51-aee8-468c-a019-e0c91626794b	2026-09-10 01:51:37.85	2026-09-13 01:51:37.85	300	CHECKED_IN	743d7e89-ae76-4b90-aa87-92273177b07d	2026-09-13 01:51:37.85	2026-09-13 01:51:37.85	\N	\N	\N	f
f6ee147a-a53b-43d3-8598-37564baa18f1	94a1d371-89bd-4efb-a3bb-55df4ca4ca0f	2026-09-26 01:51:37.851	2026-09-29 01:51:37.851	750	CONFIRMED	2a68483f-ffc1-4ea2-8a8d-474b4fe01864	2026-09-13 01:51:37.851	2026-09-13 01:51:37.851	\N	\N	\N	f
df2c14c2-a12b-4d64-8bbe-c352d2d05787	11a2cf51-aee8-468c-a019-e0c91626794b	2026-09-02 01:51:37.852	2026-09-07 01:51:37.852	500	CHECKED_OUT	ddecc379-9ae4-4c0f-90a0-0f73d3e181e3	2026-09-13 01:51:37.852	2026-09-13 01:51:37.852	\N	\N	\N	f
1cea9f17-dde6-4c02-b33a-24c8feca2699	01e37ca0-a71d-4120-8f37-a5ef6ad7dca4	2026-09-17 00:00:00	2026-09-18 00:00:00	150	CANCELLED	280ae7da-b8b0-4f10-8db1-71c0f50625f5	2026-09-16 10:10:25.491	2026-09-16 10:17:57.741	\N	\N	\N	f
72d279a7-e130-4a26-8489-69f99fbf170a	82ae4425-fca9-4c7e-8181-93af484c84c9	2026-09-16 00:00:00	2026-09-18 00:00:00	300	CONFIRMED	280ae7da-b8b0-4f10-8db1-71c0f50625f5	2026-09-16 10:19:13.457	2026-09-16 10:19:28.275	60	QR	12A34D	f
6ea05ba0-9185-43b2-9cbe-c390b4893194	9964e66a-81f5-4f0a-bece-738b9c352580	2026-09-17 00:00:00	2026-09-22 00:00:00	550	CONFIRMED	728e9f6c-8bd9-4fba-a51b-b3887ccba647	2026-09-16 12:42:50.576	2026-09-16 12:43:16.664	110	QR	23AED123	f
\.


ALTER TABLE public."Booking" ENABLE TRIGGER ALL;

--
-- Data for Name: ContactMessage; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public."ContactMessage" DISABLE TRIGGER ALL;

COPY public."ContactMessage" (id, name, email, phone, subject, message, "isRead", "createdAt") FROM stdin;
\.


ALTER TABLE public."ContactMessage" ENABLE TRIGGER ALL;

--
-- Data for Name: Image; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public."Image" DISABLE TRIGGER ALL;

COPY public."Image" (id, url, "categoryId", "createdAt") FROM stdin;
a65357f1-0d9a-4d36-a967-e8cf3f73c043	https://oylazdilvtmrfklwngxz.supabase.co/storage/v1/object/public/images/1789537324999-167713616.jpg	0d16c0ab-d3db-42dd-9728-e28b0640febf	2026-09-16 08:44:41.796
3bc25681-46db-4857-99ca-c1b0490a1450	https://oylazdilvtmrfklwngxz.supabase.co/storage/v1/object/public/images/1789537352471-750906803.avif	9b4f5419-201a-4ea3-a5e9-db7d23d07645	2026-09-16 08:44:29.062
d0df2128-4f00-46e8-9359-b884a2f3b09f	https://oylazdilvtmrfklwngxz.supabase.co/storage/v1/object/public/images/1789537379577-486356090.jpg	da0c49b6-4682-4957-bcf4-c7bd9e004369	2026-09-16 08:44:13.507
8f9eb54e-8a5d-4f8b-ac06-64c1f708a9b6	https://oylazdilvtmrfklwngxz.supabase.co/storage/v1/object/public/images/1789870972669-253292691.jpg	54dfde7a-df31-4762-83ad-94bc36cb9b10	2026-09-20 02:22:54.813
3ab840f0-b9f1-41cb-b469-d860e6f28a51	https://oylazdilvtmrfklwngxz.supabase.co/storage/v1/object/public/images/room-1.jpg	da6737ae-e291-4bd1-9f4f-09ab67689ce7	2026-09-16 07:06:54.11
05f7f468-575a-456f-819b-2a3ab7f81e30	https://oylazdilvtmrfklwngxz.supabase.co/storage/v1/object/public/images/room-3.jpg	da6737ae-e291-4bd1-9f4f-09ab67689ce7	2026-09-16 07:06:54.101
6fdd8d4b-2a38-4a73-b8cc-77e8b50f9cff	https://oylazdilvtmrfklwngxz.supabase.co/storage/v1/object/public/images/unique-room-1.jpg	da6737ae-e291-4bd1-9f4f-09ab67689ce7	2026-09-16 07:06:54.103
71c0e3bd-dda9-4c2a-958a-41e648bef425	https://oylazdilvtmrfklwngxz.supabase.co/storage/v1/object/public/images/unique-room-2.jpg	da6737ae-e291-4bd1-9f4f-09ab67689ce7	2026-09-16 07:06:54.109
ba7ea871-5541-4624-842b-c3f19e290ee1	https://oylazdilvtmrfklwngxz.supabase.co/storage/v1/object/public/images/unique-room-5.jpg	da6737ae-e291-4bd1-9f4f-09ab67689ce7	2026-09-16 07:06:54.105
\.


ALTER TABLE public."Image" ENABLE TRIGGER ALL;

--
-- Data for Name: Promotion; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public."Promotion" DISABLE TRIGGER ALL;

COPY public."Promotion" (id, code, "discountValue", "isPercentage", "validUntil", "usageLimit", "usageCount", "createdAt") FROM stdin;
0810a43c-7633-432e-9a5d-d8e8d7c89d6b	WELCOME50	50	t	\N	\N	0	2026-09-13 01:51:37.807
e29dc008-1981-40e7-a251-157cebf7d8c2	TEST	50	t	2026-09-21 00:00:00	\N	0	2026-09-20 02:23:44.762
\.


ALTER TABLE public."Promotion" ENABLE TRIGGER ALL;

--
-- Data for Name: Review; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public."Review" DISABLE TRIGGER ALL;

COPY public."Review" (id, "guestId", "bookingId", rating, comment, "isApproved", "createdAt") FROM stdin;
94d8ddac-3f81-4529-9ed5-8b80fd037c69	b8cbde8e-e669-411d-b6fe-8870ae5011f2	5666384c-082f-4805-9477-93d5fd6ea9a9	4	Great stay!	t	2026-09-13 01:51:37.817
7043462e-d691-4a31-993d-60d75edcf32d	94a1d371-89bd-4efb-a3bb-55df4ca4ca0f	dbe3fc9a-c040-4dbc-b9d9-f9b44d44af79	5	Great stay!	t	2026-09-13 01:51:37.824
27ae6796-8c1d-4709-8429-aa41767f52f7	b8cbde8e-e669-411d-b6fe-8870ae5011f2	725b2fc1-1924-41e3-b524-25c6f2e3ed2c	4	Great stay!	t	2026-09-13 01:51:37.828
3fe64550-85a0-4f0b-9e66-4e0a901b4ce3	94a1d371-89bd-4efb-a3bb-55df4ca4ca0f	eee09c33-3ca2-4a76-8694-f4ef9bf51e33	5	Great stay!	t	2026-09-13 01:51:37.831
64641a88-094a-4f24-9744-352191b3eef8	94a1d371-89bd-4efb-a3bb-55df4ca4ca0f	169c3405-46fd-4ebd-bc55-de05379dc428	5	Great stay!	t	2026-09-13 01:51:37.84
8d189b38-d222-4d30-9563-99e207e63c5e	11a2cf51-aee8-468c-a019-e0c91626794b	9e1ca556-76db-42b4-83ea-4929cb88839a	5	Great stay!	t	2026-09-13 01:51:37.843
1461d6f0-ac0d-440c-b530-aad565811498	b8cbde8e-e669-411d-b6fe-8870ae5011f2	c7ee6362-d70d-477f-9b45-20a8898a7c83	4	Great stay!	t	2026-09-13 01:51:37.845
0544c68c-539f-49c2-8227-97d8eea11c01	b8cbde8e-e669-411d-b6fe-8870ae5011f2	f08f91e1-a89e-4903-ba22-e9dadf215388	4	Great stay!	t	2026-09-13 01:51:37.849
68fefc3d-e657-46df-a8cb-7f96865b48c0	11a2cf51-aee8-468c-a019-e0c91626794b	df2c14c2-a12b-4d64-8bbe-c352d2d05787	4	Great stay!	t	2026-09-13 01:51:37.854
\.


ALTER TABLE public."Review" ENABLE TRIGGER ALL;

--
-- Data for Name: Role; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public."Role" DISABLE TRIGGER ALL;

COPY public."Role" (id, name, permissions, "createdAt", "updatedAt") FROM stdin;
8127b72d-41b3-4e0c-a93e-11712a9b63d6	ADMIN	{ALL}	2026-09-13 01:51:37.66	2026-09-13 01:51:37.66
7874aa2d-6b87-4456-822c-1223c3e7f520	test	{Dashboard,Bookings,Rooms,Guests}	2026-09-20 02:29:43.037	2026-09-20 02:29:43.037
\.


ALTER TABLE public."Role" ENABLE TRIGGER ALL;

--
-- Data for Name: Setting; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public."Setting" DISABLE TRIGGER ALL;

COPY public."Setting" (id, key, value, "createdAt", "updatedAt") FROM stdin;
96cf678c-9df6-4e6b-a983-ffea2473a082	homepage_settings	{"theme":{"primaryColor":"bg-zinc-900","secondaryColor":"bg-zinc-100","fontFamily":"font-lora","headingFontFamily":"font-nove","headingFontSize":"80px ","bodyFontSize":"20px","adminHeadingFontSize":"50px"},"loader":{"isVisible":true,"iconUrl":""},"hero":{"isVisible":true,"title":"Where Elegance Meets Exceptional Service","subtitle":"<p>Step into a world of <strong>refined beauty</strong> and uncompromising comfort. Your extraordinary journey begins the moment you arrive.</p>","videoUrl":"/uploads/1789301378477-596276179.mp4","backgroundImageFallback":"https://images.unsplash.com/photo-1542314831-c53cd4b85d85?q=80&w=3270&auto=format&fit=crop","buttonLabel":"Reserve Your Experience","titleSize":"text-6xl md:text-8xl leading-tight","subtitleSize":"text-lg md:text-xl font-light"},"searchHero":{"isVisible":true,"videoUrl":"/uploads/1789297793949-797680564.mp4"},"featuredRooms":{"isVisible":true,"title":"Our Accommodations","description":"Experience comfort and luxury in our meticulously designed rooms and suites.","rooms":[{"id":"1","name":"Ocean View Suite","description":"Wake up to breathtaking views of the ocean in our signature suite.","image":"https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=3270&auto=format&fit=crop","price":450,"amenities":["King Bed","Ocean View","Balcony","Mini Bar"]},{"id":"2","name":"Executive Room","description":"Perfect for business travelers seeking comfort and productivity.","image":"https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=3270&auto=format&fit=crop","price":280,"amenities":["Queen Bed","City View","Desk","Free WiFi"]},{"id":"3","name":"Presidential Penthouse","description":"The ultimate luxury experience with panoramic views and premium services.","image":"https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=3270&auto=format&fit=crop","price":1200,"amenities":["King Bed","Panoramic View","Private Jacuzzi","Butler Service"]},{"id":"4","name":"Superior Room","description":"Elegantly appointed room where refinement meets contemporary style.","image":"https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=3270&auto=format&fit=crop","price":320,"amenities":["King Bed","City View","Lounge Area","Free WiFi"]},{"id":"5","name":"Superior Accessible Room","description":"Thoughtfully designed for both relaxation and connection with accessible features.","image":"https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=3270&auto=format&fit=crop","price":320,"amenities":["King Bed","Accessible","City View","Roll-in Shower"]},{"id":"6","name":"Superior Double Room","description":"Perfect for families or groups, featuring two comfortable double beds.","image":"https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=3270&auto=format&fit=crop","price":350,"amenities":["2 Double Beds","City View","Bathtub","Free WiFi"]},{"id":"7","name":"Deluxe Harbour View","description":"Enjoy sweeping views of the harbor from this elevated deluxe room.","image":"https://images.unsplash.com/photo-1574643156929-51fa098b0394?q=80&w=3270&auto=format&fit=crop","price":480,"amenities":["King Bed","Harbour View","Balcony","Espresso Machine"]},{"id":"8","name":"Club Millésime Room","description":"Exclusive access to our Club Lounge with complimentary breakfast and evening canapés.","image":"https://images.unsplash.com/photo-1598928506311-c55dd5802c27?q=80&w=3270&auto=format&fit=crop","price":550,"amenities":["King Bed","High Floor","Club Access","City View"]},{"id":"9","name":"Family Suite","description":"Spacious suite designed for families, featuring a separate living area.","image":"https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=3270&auto=format&fit=crop","price":650,"amenities":["King Bed & Sofa Bed","Kitchenette","City View","2 Bathrooms"]},{"id":"10","name":"Royal Suite","description":"Our most prestigious accommodation offering unparalleled luxury and space.","image":"https://images.unsplash.com/photo-1631049552057-403cdb8f0658?q=80&w=3270&auto=format&fit=crop","price":2500,"amenities":["King Bed","Panoramic Ocean View","Dining Room","24/7 Butler"]}]},"culinary":{"isVisible":true,"title":"Culinary Excellence","description":"<p>Embark on a <strong>gastronomic journey</strong> with our award-winning chefs. From authentic local flavors to exquisite international cuisine, every dish is a masterpiece designed to delight your senses.</p><p></p>","image":"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=3270&auto=format&fit=crop","buttonLabel":"Explore Dining"},"spaWellness":{"isVisible":true,"title":"Spa & Wellness","description":"Rejuvenate your body and soul in our tranquil sanctuary. Offering personalized treatments, state-of-the-art facilities, and holistic therapies to restore your inner balance.","image":"https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=3270&auto=format&fit=crop","buttonLabel":"View Treatments"},"amenities":{"isVisible":true,"title":"World-Class Amenities","description":"Everything you need for a perfect stay is right here.","items":[{"icon":"Wifi","title":"High-Speed WiFi","description":"Stay connected with complimentary high-speed internet throughout the hotel."},{"icon":"Coffee","title":"Premium Coffee","description":"Enjoy artisanal coffee and pastries at our lobby cafe."},{"icon":"Utensils","title":"Fine Dining","description":"Experience culinary excellence at our award-winning restaurants."},{"icon":"Dumbbell","title":"Fitness Center","description":"Keep up with your fitness routine in our state-of-the-art gym."}]},"testimonials":{"isVisible":true,"title":"What Our Guests Say","items":[{"name":"Sarah Johnson","role":"Business Traveler","quote":"An absolutely incredible stay. The service was impeccable and the room was stunning.","rating":5},{"name":"Michael Chen","role":"Vacationer","quote":"The best hotel experience I have ever had. The attention to detail is unmatched.","rating":5},{"name":"Emma Williams","role":"Honeymooner","quote":"Perfect romantic getaway. The ocean view suite exceeded all our expectations.","rating":5}]},"experiences":{"isVisible":true,"title":"Bespoke Experiences","description":"Immerse yourself in curated activities designed to elevate your stay. From private yacht charters to exclusive wine tastings, every moment is crafted to perfection.","image":"https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=3270&auto=format&fit=crop","buttonLabel":"Discover More"},"ourStory":{"isVisible":true,"title":"A Legacy of Elegance","description":"Since 1924, Hotel Luxury has been the pinnacle of extraordinary hospitality. Our walls hold the stories of dignitaries, artists, and lovers who have sought refuge in our timeless embrace.","image":"/uploads/1789301559052-288025067.jpg","buttonLabel":"Read Our Story"},"bookingCta":{"isVisible":true,"title":"Your Extraordinary Journey Awaits","description":"Reserve your unparalleled experience today and step into a world of refined beauty.","buttonLabel":"Book Your Stay","image":"/uploads/1789301860605-332053231.jpg"},"footer":{"isVisible":true,"brandDescription":"Experience the pinnacle of hospitality. Where every stay is a story worth telling.","address":"123 Luxury Ave, Resort City, RC 12345","phone":"+1 (555) 123-4567","email":"reservations@hotel.com","copyright":"© 2026 Hotel Luxury. All rights reserved.","socialLinks":[{"id":"1","platform":"twitter","url":"#","isVisible":true},{"id":"2","platform":"instagram","url":"#","isVisible":true},{"id":"3","platform":"facebook","url":"#","isVisible":true}],"exploreLinks":[{"id":"1","label":"Rooms & Suites","href":"/rooms","isVisible":true},{"id":"2","label":"Dining","href":"/dining","isVisible":true},{"id":"3","label":"Spa & Wellness","href":"/spa","isVisible":true},{"id":"4","label":"Offers","href":"/offers","isVisible":true},{"id":"5","label":"Gallery","href":"/gallery","isVisible":true}],"quickLinks":[{"id":"1","label":"About Us","href":"/about","isVisible":true},{"id":"2","label":"Contact Us","href":"/contact","isVisible":true},{"id":"3","label":"Terms & Conditions","href":"/terms","isVisible":true},{"id":"4","label":"Privacy Policy","href":"/privacy","isVisible":true},{"id":"5","label":"FAQs","href":"/faq","isVisible":true}]}}	2026-09-13 12:02:02.088	2026-09-20 02:26:18.913
480fb034-09aa-47e8-8278-87cf10c064ef	rooms_page_settings	{"hero":{"isVisible":true,"title":"ROOMS & SUITES","subtitle":"Experience unparalleled luxury and heritage.","image":"/uploads/1789384331991-514745558.jpg","videoUrl":"/uploads/1789632449611-862912408.mp4"},"listSection":{"isVisible":true,"title":"Our Accommodations","description":"Explore our curated selection of fine rooms."},"detailsHero":{"isVisible":true,"title":"","videoUrl":"/uploads/1789301378477-596276179.mp4","image":null},"amenitiesSection":{"isVisible":true,"title":"ROOM AMENITIES","subtitle":"Designed for your comfort"},"bookingCta":{"isVisible":true,"title":"Ready to Experience luxury?","description":"Book your stay today and discover the unparalleled luxury of our hotel.","image":null,"buttonLabel":"Book Now"}}	2026-09-14 11:07:32.586	2026-09-17 08:07:31.998
490f8024-5659-4015-a709-434249f51d61	payment-settings	{"enablePaymentOptions":true,"reservationFeePercentage":20,"enableQrCode":true,"qrCodeImageUrl":"/uploads/1789550123500-876285809.avif","enableStripe":false,"stripePublicKey":"","stripeSecretKey":""}	2026-09-16 09:15:25.852	2026-09-16 12:44:00.912
26ae68c3-3b2c-4655-9488-e924a256c069	GALLERY_PAGE_SETTINGS	{"hero":{"isVisible":true,"title":"The Gallery","description":"Explore the architectural elegance, exquisite interiors, and stunning surroundings of Hotel Luxury.","image":"/uploads/1789659673667-847637690.jpg","typography":{}},"categories":[{"id":"all","name":"All"},{"id":"exterior","name":"Exterior"},{"id":"interior","name":"Interior"},{"id":"rooms","name":"Rooms & Suites"},{"id":"dining","name":"Dining"},{"id":"wellness","name":"Wellness"}],"images":[{"id":"img-1","url":"/uploads/unsplash-1566073771259-6a8506099945.jpg","title":"Resort Exterior","categoryId":"exterior"},{"id":"img-2","url":"/uploads/unsplash-1611892440504-42a792e24d32.jpg","title":"Luxury Suite Bedroom","categoryId":"rooms"},{"id":"img-3","url":"/uploads/unsplash-1544161515-4ab6ce6db874.jpg","title":"Spa Massage Room","categoryId":"wellness"},{"id":"img-4","url":"/uploads/unsplash-1514933651103-005eec06c04b.jpg","title":"Fine Dining Restaurant","categoryId":"dining"},{"id":"img-5","url":"/uploads/unsplash-1578683010236-d716f9a3f461.jpg","title":"Grand Lobby","categoryId":"interior"},{"id":"img-6","url":"/uploads/unsplash-1582719478250-c89cae4dc85b.jpg","title":"Presidential Suite Lounge","categoryId":"rooms"},{"id":"img-7","url":"/uploads/unsplash-1540555700478-4be289fbecef.jpg","title":"Indoor Spa Pool","categoryId":"wellness"},{"id":"img-8","url":"/uploads/unsplash-1571257121735-a7db2e38148f.jpg","title":"Thermal Baths","categoryId":"wellness"},{"id":"img-9","url":"/uploads/unsplash-1551882547-ff40c0d5e9af.jpg","title":"Bar & Lounge","categoryId":"dining"},{"id":"1789871336302","url":"/uploads/1789871336121-888840733.jpg","title":"images.jpg","categoryId":"All"}]}	2026-09-17 15:41:16.717	2026-09-20 02:29:00.856
c9e49763-0140-4321-a109-739d0bcb5fc1	DINING_PAGE_SETTINGS	{"hero":{"isVisible":true,"title":"An unforgettable culinary journey.","image":"/uploads/1789623379466-185085775.jpg","videoUrl":null,"subtitle":"Experience the finest traditional recipes brought to life by master chefs."},"intro":{"isVisible":false,"title":"An unforgettable culinary journey.","description":"<p>Experience the finest traditional recipes brought to life by master chefs.</p>"},"restaurantsList":{"isVisible":true,"title":"Our Venues","description":"Explore our distinctive dining venues and culinary experiences.","venues":[{"id":"1789624957985","name":"The Courtyard","details":"Nestled among lush greenery and rustic brickwork, The Courtyard offers open-air artisanal dining, wood-fired specialties, and handcrafted cocktails under the open sky.","image":"/uploads/1789624953993-88842648.jpg"},{"id":"1789625029149","name":"The Lounge","details":"Crafted for quiet conversations and evening indulgence, The Lounge pairs artisanal spirits and rare vintages with an intimate, upscale atmosphere.","image":"/uploads/1789624997004-36684038.jpg"}]},"philosophy":{"isVisible":true,"title":"Our Culinary Philosophy","description":"<p>Rooted in tradition, driven by seasonality.</p>","image":null,"videoUrl":null,"stats":[{"id":"1","label":"Local Ingredients","value":"80%"},{"id":"2","label":"Kilometer Radius","value":"50km"},{"id":"3","label":"Partner Farms","value":"12"}],"typography":{}},"menus":{"isVisible":true,"title":"Our Menus","description":"Explore our seasonal offerings across all venues.","categories":[],"typography":{}},"events":{"isVisible":true,"title":"Events & Private Dining","description":"<p>Host exceptional gatherings with personalized sophistication. Whether you are planning a high-profile executive dinner, a private corporate celebration, or an intimate family event, our private dining venues provide the ultimate balance of privacy and style. Enjoy custom-tailored seasonal menus, premium beverage programs, and seamless event coordination designed to ensure every detail is executed effortlessly.</p>","images":[{"id":"e1","url":"/uploads/events_wine_tasting_1789633002418.jpg"},{"id":"e2","url":"/uploads/unique-room-1.jpg"},{"id":"e3","url":"/uploads/unique-room-2.jpg"}],"typography":{}},"bar":{"isVisible":true,"title":"The Bar & Lounge","description":"<p>Designed as an inviting retreat from the bustle of the day, The Bar &amp; Lounge transitions seamlessly from a relaxed afternoon lounge into an alluring evening destination. Discover handcrafted signature drinks infused with premium botanicals, aged whiskeys, and cellar-select vintages paired with chef-crafted bites. It is the ideal space to gather, celebrate, or simply savor the art of fine drinking in style.</p>","images":[{"id":"b1","url":"/uploads/bar_interior_1789632964846.jpg"},{"id":"b2","url":"/uploads/cocktail_closeup_1789632977279.jpg"},{"id":"b3","url":"/uploads/exterior.jpg"}],"typography":{}},"liveMusic":{"isVisible":true,"title":"Live Entertainment","description":"<p>Immerse yourself in an enchanting evening of music, rhythm, and vibrant energy. From sultry acoustic sets and live jazz sessions to contemporary weekend showcases, our curated live entertainment program brings the venue to life. Sip on artisanal cocktails and unwind in an electric yet intimate atmosphere where talented local and guest performers create unforgettable nights.</p>","images":[{"id":"17896340304451","url":"/uploads/1789634030413-505755305.jpg"},{"id":"17896340301370","url":"/uploads/1789634030071-480098938.jpg"},{"id":"17896340305692","url":"/uploads/1789634030561-817984601.jpg"}],"typography":{}},"privateDining":{"isVisible":true,"title":"Private Dining","description":"<p>Elevate your special occasions in a private enclave where tailored luxury meets fine dining. Whether you are hosting an intimate banquet, a confidential business dinner, or an anniversary celebration, Private Dining pairs custom gastronomic menus with dedicated sommelier pairings. Surrounded by refined design and personalized hospitality, your guests will enjoy a truly bespoke culinary journey away from the public eye.</p>","images":[{"id":"pd1","url":"/uploads/unique-room-3.jpg"},{"id":"pd2","url":"/uploads/unique-room-4.jpg"},{"id":"pd3","url":"/uploads/unique-room-5.jpg"}],"typography":{}}}	2026-09-17 05:36:20.821	2026-09-17 08:33:56.433
e017b47c-dc34-48ee-beea-adbd42f9a167	about_settings	{"hero":{"title":"Our Heritage","subtitle":"A legacy of uncompromising luxury and timeless elegance.","image":"/uploads/1789704757925-915479189.avif"},"ourStory":{"title":"A Story of Excellence","content":"Since our founding, Hotel Luxury has been synonymous with unparalleled hospitality. What began as a grand vision has blossomed into an iconic sanctuary for global travelers.\\nWe believe in the art of hospitality, where every detail is meticulously curated to create moments that linger long after our guests depart.","image1":"/uploads/1789704801905-507232568.jpg","image2":"https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=3270&auto=format&fit=crop"},"coreValues":{"title":"Our Core Values","subtitle":"The principles that guide every interaction and experience at Hotel Luxury.","values":[{"title":"Unwavering Excellence","description":"We accept nothing less than perfection in our service and our spaces.","icon":"Star"},{"title":"Authentic Connection","description":"We forge genuine relationships with our guests to anticipate their every need.","icon":"Heart"},{"title":"Timeless Elegance","description":"We honor our heritage while embracing modern comforts and sustainable practices.","icon":"Gem"}]},"team":{"title":"The Visionaries","subtitle":"Meet the passionate individuals dedicated to orchestrating your perfect stay.","members":[{"name":"Eleanor Sterling","role":"General Manager","image":"https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=3270&auto=format&fit=crop"},{"name":"Julian Vance","role":"Executive Chef","image":"https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=3270&auto=format&fit=crop"},{"name":"Sophia Laurent","role":"Director of Guest Experience","image":"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=3270&auto=format&fit=crop"}]},"contactBlock":{"title":"Begin Your Journey","description":"We look forward to welcoming you to an unforgettable experience.","phone":"+1 (555) 123-4567","email":"reservations@hotel.com","buttonLabel":"Contact Us"}}	2026-09-18 04:11:24.293	2026-09-18 04:19:26.579
6bb8177b-fcd0-4fb4-9a4c-1093806d746b	contact_settings	{"header":{"title":"Contact Us","subtitle":"We are here to assist you with any inquiries or special requests. Please feel free to reach out to our dedicated team.","image":"/uploads/1789711479108-708370056.jpg"},"contactInfo":{"title":"Get in Touch","description":"Whether you're planning your next stay, organizing an event, or simply have a question, our team is ready to provide you with the highest level of service."},"location":{"title":"Our Location","address":"123 Luxury Avenue\\nMetropolis, NY 10001\\nUnited States"},"phone":{"title":"Phone","number":"+1 (555) 123-4567","availability":"Available 24/7"},"email":{"title":"Email","address":"reservations@thehotel.com"}}	2026-09-18 05:58:43.183	2026-09-18 06:04:39.599
\.


ALTER TABLE public."Setting" ENABLE TRIGGER ALL;

--
-- Data for Name: Transaction; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public."Transaction" DISABLE TRIGGER ALL;

COPY public."Transaction" (id, amount, type, description, gateway, date, "bookingId", "createdAt", "updatedAt", "bookingDate", contact, duration, "guestName", "refCode") FROM stdin;
95dbdda8-098d-405f-937e-fbdc907e0bb4	1250	INCOME	Payment for booking 5666384c-082f-4805-9477-93d5fd6ea9a9	eSewa	2026-09-13 01:51:37.816	5666384c-082f-4805-9477-93d5fd6ea9a9	2026-09-13 01:51:37.816	2026-09-13 01:51:37.816	\N	\N	\N	\N	\N
a02be223-59c5-480a-ac57-2dbbdaa861d6	750	INCOME	Payment for booking 61a472db-322a-404f-8b7a-98d32bf4c41a	eSewa	2026-09-13 01:51:37.821	61a472db-322a-404f-8b7a-98d32bf4c41a	2026-09-13 01:51:37.821	2026-09-13 01:51:37.821	\N	\N	\N	\N	\N
100caa3b-1378-45fb-b09c-11e5844764c5	300	INCOME	Payment for booking dbe3fc9a-c040-4dbc-b9d9-f9b44d44af79	eSewa	2026-09-13 01:51:37.824	dbe3fc9a-c040-4dbc-b9d9-f9b44d44af79	2026-09-13 01:51:37.824	2026-09-13 01:51:37.824	\N	\N	\N	\N	\N
badc2b29-65c3-47cf-a3c4-6da6e8efb7cf	210	INCOME	Payment for booking 725b2fc1-1924-41e3-b524-25c6f2e3ed2c	eSewa	2026-09-13 01:51:37.826	725b2fc1-1924-41e3-b524-25c6f2e3ed2c	2026-09-13 01:51:37.826	2026-09-13 01:51:37.826	\N	\N	\N	\N	\N
95caa341-7751-4b09-963e-89b221b2f686	100	INCOME	Payment for booking eee09c33-3ca2-4a76-8694-f4ef9bf51e33	eSewa	2026-09-13 01:51:37.831	eee09c33-3ca2-4a76-8694-f4ef9bf51e33	2026-09-13 01:51:37.831	2026-09-13 01:51:37.831	\N	\N	\N	\N	\N
bd159275-bcb0-477d-8feb-9fc6cbc98945	750	INCOME	Payment for booking 66965a6d-8951-4f4b-808d-cb42d993b7aa	eSewa	2026-09-13 01:51:37.832	66965a6d-8951-4f4b-808d-cb42d993b7aa	2026-09-13 01:51:37.832	2026-09-13 01:51:37.832	\N	\N	\N	\N	\N
10741b1c-a1dc-46b2-950c-bae4e2731149	630	INCOME	Payment for booking e36da4e2-f0dc-4d54-8d25-791373c52777	eSewa	2026-09-13 01:51:37.833	e36da4e2-f0dc-4d54-8d25-791373c52777	2026-09-13 01:51:37.833	2026-09-13 01:51:37.833	\N	\N	\N	\N	\N
859f219c-0a30-4e7c-8dd9-644458db6ddc	1300	INCOME	Payment for booking 979809de-7f0c-4e2d-9523-9c916cbaa6fb	eSewa	2026-09-13 01:51:37.834	979809de-7f0c-4e2d-9523-9c916cbaa6fb	2026-09-13 01:51:37.834	2026-09-13 01:51:37.834	\N	\N	\N	\N	\N
b8535b1d-af2d-4eec-b626-aa1e965936e7	160	INCOME	Payment for booking 75c13500-4e0a-44bf-93ca-983e0b2f240c	eSewa	2026-09-13 01:51:37.836	75c13500-4e0a-44bf-93ca-983e0b2f240c	2026-09-13 01:51:37.836	2026-09-13 01:51:37.836	\N	\N	\N	\N	\N
4a6bc3fe-7dfc-4350-86d3-953447fac1cf	800	INCOME	Payment for booking 9c559f33-1383-4ba1-8cf7-6cd923d055e0	eSewa	2026-09-13 01:51:37.837	9c559f33-1383-4ba1-8cf7-6cd923d055e0	2026-09-13 01:51:37.837	2026-09-13 01:51:37.837	\N	\N	\N	\N	\N
95b1a305-fc33-4d8b-8883-2138ca8e30f7	260	INCOME	Payment for booking 30755379-7fd1-49a2-a036-cb5a0452ad29	eSewa	2026-09-13 01:51:37.838	30755379-7fd1-49a2-a036-cb5a0452ad29	2026-09-13 01:51:37.838	2026-09-13 01:51:37.838	\N	\N	\N	\N	\N
7423d7b8-7830-4f8a-9f43-d41f464b65fb	550	INCOME	Payment for booking 169c3405-46fd-4ebd-bc55-de05379dc428	eSewa	2026-09-13 01:51:37.84	169c3405-46fd-4ebd-bc55-de05379dc428	2026-09-13 01:51:37.84	2026-09-13 01:51:37.84	\N	\N	\N	\N	\N
42baf9b4-c345-4ee0-9369-3a36b3e64340	500	INCOME	Payment for booking 9c5c5eaa-2a45-4751-b56f-ba7c2c8702ed	eSewa	2026-09-13 01:51:37.841	9c5c5eaa-2a45-4751-b56f-ba7c2c8702ed	2026-09-13 01:51:37.841	2026-09-13 01:51:37.841	\N	\N	\N	\N	\N
31a052e2-e9ec-4376-8bfd-af36232400d2	1040	INCOME	Payment for booking 9e1ca556-76db-42b4-83ea-4929cb88839a	eSewa	2026-09-13 01:51:37.843	9e1ca556-76db-42b4-83ea-4929cb88839a	2026-09-13 01:51:37.843	2026-09-13 01:51:37.843	\N	\N	\N	\N	\N
d6f063ce-51c6-48a0-9bff-01b5a5276562	400	INCOME	Payment for booking c7ee6362-d70d-477f-9b45-20a8898a7c83	eSewa	2026-09-13 01:51:37.845	c7ee6362-d70d-477f-9b45-20a8898a7c83	2026-09-13 01:51:37.845	2026-09-13 01:51:37.845	\N	\N	\N	\N	\N
6ab3573a-6ad3-4754-aa82-82be61b07511	780	INCOME	Payment for booking ebd03c94-a2a7-45c8-a732-e6f7ef47df78	eSewa	2026-09-13 01:51:37.846	ebd03c94-a2a7-45c8-a732-e6f7ef47df78	2026-09-13 01:51:37.846	2026-09-13 01:51:37.846	\N	\N	\N	\N	\N
e91e66ed-5e94-467f-8b45-d2d503042b20	750	INCOME	Payment for booking f08f91e1-a89e-4903-ba22-e9dadf215388	eSewa	2026-09-13 01:51:37.848	f08f91e1-a89e-4903-ba22-e9dadf215388	2026-09-13 01:51:37.848	2026-09-13 01:51:37.848	\N	\N	\N	\N	\N
3a0d5876-c475-4dad-8f2a-6cbd286aae56	300	INCOME	Payment for booking 009b051d-3a39-48bf-9b15-7355037193c7	eSewa	2026-09-13 01:51:37.851	009b051d-3a39-48bf-9b15-7355037193c7	2026-09-13 01:51:37.851	2026-09-13 01:51:37.851	\N	\N	\N	\N	\N
63ca9c82-6857-4702-b6f1-94e70eacff3d	750	INCOME	Payment for booking f6ee147a-a53b-43d3-8598-37564baa18f1	eSewa	2026-09-13 01:51:37.852	f6ee147a-a53b-43d3-8598-37564baa18f1	2026-09-13 01:51:37.852	2026-09-13 01:51:37.852	\N	\N	\N	\N	\N
73b119eb-6622-4fc8-b867-cb528705a856	500	INCOME	Payment for booking df2c14c2-a12b-4d64-8bbe-c352d2d05787	eSewa	2026-09-13 01:51:37.853	df2c14c2-a12b-4d64-8bbe-c352d2d05787	2026-09-13 01:51:37.853	2026-09-13 01:51:37.853	\N	\N	\N	\N	\N
\.


ALTER TABLE public."Transaction" ENABLE TRIGGER ALL;

--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public."User" DISABLE TRIGGER ALL;

COPY public."User" (id, email, password, name, "roleId", "createdAt", "updatedAt") FROM stdin;
12210d11-67f3-4f2b-b001-d8d2f94c1505	test@test.com	$2b$10$37K07eChMecB7dklMmZlEuRspDdfiFawyBBJwJUkSmGvzEcrn7E5C	test	7874aa2d-6b87-4456-822c-1223c3e7f520	2026-09-20 02:29:59.095	2026-09-20 02:43:58.427
cd60d128-a6e2-4961-b11c-ef3493f3cac7	admin@hotel.com	$2b$10$JrJPprtUkm5idL2CXzw72uNCMn3CRXoSwr9s6xUBfeMSxhyFyypMK	Hotel Admin	8127b72d-41b3-4e0c-a93e-11712a9b63d6	2026-09-13 01:51:37.675	2026-09-20 03:13:00.657
\.


ALTER TABLE public."User" ENABLE TRIGGER ALL;

--
-- Data for Name: _AmenityToRoom; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public."_AmenityToRoom" DISABLE TRIGGER ALL;

COPY public."_AmenityToRoom" ("A", "B") FROM stdin;
\.


ALTER TABLE public."_AmenityToRoom" ENABLE TRIGGER ALL;

--
-- Data for Name: _AmenityToRoomCategory; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public."_AmenityToRoomCategory" DISABLE TRIGGER ALL;

COPY public."_AmenityToRoomCategory" ("A", "B") FROM stdin;
a1cff829-e054-4095-bf48-86c68ad2fc09	da6737ae-e291-4bd1-9f4f-09ab67689ce7
2db92823-611b-46b6-8cfe-54b514120e04	da6737ae-e291-4bd1-9f4f-09ab67689ce7
42ea5823-3f10-4df1-b47e-d7ac11c0c670	da6737ae-e291-4bd1-9f4f-09ab67689ce7
a1cff829-e054-4095-bf48-86c68ad2fc09	da0c49b6-4682-4957-bcf4-c7bd9e004369
2db92823-611b-46b6-8cfe-54b514120e04	da0c49b6-4682-4957-bcf4-c7bd9e004369
42ea5823-3f10-4df1-b47e-d7ac11c0c670	da0c49b6-4682-4957-bcf4-c7bd9e004369
b2a75d76-958c-4682-9600-a8d0719e6817	da0c49b6-4682-4957-bcf4-c7bd9e004369
38f6c47f-d7ad-4386-946c-781c1e21f0e2	da0c49b6-4682-4957-bcf4-c7bd9e004369
8ea02106-041e-42ea-a653-b30c3e88fea5	da0c49b6-4682-4957-bcf4-c7bd9e004369
a1cff829-e054-4095-bf48-86c68ad2fc09	9b4f5419-201a-4ea3-a5e9-db7d23d07645
2db92823-611b-46b6-8cfe-54b514120e04	9b4f5419-201a-4ea3-a5e9-db7d23d07645
42ea5823-3f10-4df1-b47e-d7ac11c0c670	9b4f5419-201a-4ea3-a5e9-db7d23d07645
a1cff829-e054-4095-bf48-86c68ad2fc09	0d16c0ab-d3db-42dd-9728-e28b0640febf
2db92823-611b-46b6-8cfe-54b514120e04	0d16c0ab-d3db-42dd-9728-e28b0640febf
42ea5823-3f10-4df1-b47e-d7ac11c0c670	0d16c0ab-d3db-42dd-9728-e28b0640febf
a1cff829-e054-4095-bf48-86c68ad2fc09	54dfde7a-df31-4762-83ad-94bc36cb9b10
2db92823-611b-46b6-8cfe-54b514120e04	54dfde7a-df31-4762-83ad-94bc36cb9b10
42ea5823-3f10-4df1-b47e-d7ac11c0c670	54dfde7a-df31-4762-83ad-94bc36cb9b10
b2a75d76-958c-4682-9600-a8d0719e6817	54dfde7a-df31-4762-83ad-94bc36cb9b10
38f6c47f-d7ad-4386-946c-781c1e21f0e2	54dfde7a-df31-4762-83ad-94bc36cb9b10
8ea02106-041e-42ea-a653-b30c3e88fea5	54dfde7a-df31-4762-83ad-94bc36cb9b10
c4a80a88-670b-4596-8715-ceb9af8f2d63	54dfde7a-df31-4762-83ad-94bc36cb9b10
\.


ALTER TABLE public."_AmenityToRoomCategory" ENABLE TRIGGER ALL;

--
-- PostgreSQL database dump complete
--

\unrestrict XyUZfzU0iQ4vugU4j3N0mJAgB8nq5UuR1of73TsGsPBB1g0APhqhzz7zn8TxQTm

