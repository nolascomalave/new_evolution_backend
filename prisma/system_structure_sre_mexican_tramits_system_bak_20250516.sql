--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

-- Started on 2025-05-16 19:24:25 -04

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE postgres;
--
-- TOC entry 4126 (class 1262 OID 5)
-- Name: postgres; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE postgres WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'C';


ALTER DATABASE postgres OWNER TO postgres;

\connect postgres

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4127 (class 0 OID 0)
-- Dependencies: 4126
-- Name: DATABASE postgres; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON DATABASE postgres IS 'default administrative connection database';


--
-- TOC entry 8 (class 2615 OID 16396)
-- Name: sre_mexican_tramits_system; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA sre_mexican_tramits_system;


ALTER SCHEMA sre_mexican_tramits_system OWNER TO postgres;

--
-- TOC entry 9 (class 2615 OID 25241)
-- Name: system_structure_sre_mexican_tramits_system; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA system_structure_sre_mexican_tramits_system;


ALTER SCHEMA system_structure_sre_mexican_tramits_system OWNER TO postgres;

--
-- TOC entry 2301 (class 3456 OID 33511)
-- Name: case_and_accent_insensitive; Type: COLLATION; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

CREATE COLLATION system_structure_sre_mexican_tramits_system.case_and_accent_insensitive (provider = icu, deterministic = false, locale = 'und-u-ks-level1');


ALTER COLLATION system_structure_sre_mexican_tramits_system.case_and_accent_insensitive OWNER TO postgres;

--
-- TOC entry 3302 (class 3456 OID 33567)
-- Name: case_insensitive; Type: COLLATION; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

CREATE COLLATION system_structure_sre_mexican_tramits_system.case_insensitive (provider = icu, deterministic = false, locale = 'und-u-ks-level2');


ALTER COLLATION system_structure_sre_mexican_tramits_system.case_insensitive OWNER TO postgres;

--
-- TOC entry 3 (class 3079 OID 33516)
-- Name: unaccent; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA system_structure_sre_mexican_tramits_system;


--
-- TOC entry 4128 (class 0 OID 0)
-- Dependencies: 3
-- Name: EXTENSION unaccent; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION unaccent IS 'text search dictionary that removes accents';


--
-- TOC entry 2 (class 3079 OID 16385)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 4129 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- TOC entry 990 (class 1247 OID 25260)
-- Name: entity_gender_enum; Type: TYPE; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

CREATE TYPE system_structure_sre_mexican_tramits_system.entity_gender_enum AS ENUM (
    'Male',
    'Female'
);


ALTER TYPE system_structure_sre_mexican_tramits_system.entity_gender_enum OWNER TO postgres;

--
-- TOC entry 993 (class 1247 OID 25266)
-- Name: entity_name_type_type_enum; Type: TYPE; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

CREATE TYPE system_structure_sre_mexican_tramits_system.entity_name_type_type_enum AS ENUM (
    'Name',
    'Surname',
    'Alias',
    'Business Name',
    'Comercial Designation'
);


ALTER TYPE system_structure_sre_mexican_tramits_system.entity_name_type_type_enum OWNER TO postgres;

--
-- TOC entry 285 (class 1255 OID 33469)
-- Name: iif(boolean, anyelement, anyelement); Type: FUNCTION; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

CREATE FUNCTION system_structure_sre_mexican_tramits_system.iif(boolean, anyelement, anyelement) RETURNS anyelement
    LANGUAGE plpgsql IMMUTABLE
    AS $_$
BEGIN
    IF $1 THEN
        RETURN $2;
    ELSE
        RETURN $3;
    END IF;
END;
$_$;


ALTER FUNCTION system_structure_sre_mexican_tramits_system.iif(boolean, anyelement, anyelement) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 16803)
-- Name: company; Type: TABLE; Schema: sre_mexican_tramits_system; Owner: postgres
--

CREATE TABLE sre_mexican_tramits_system.company (
    id bigint NOT NULL,
    company character varying(250) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE sre_mexican_tramits_system.company OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16829)
-- Name: company_email; Type: TABLE; Schema: sre_mexican_tramits_system; Owner: postgres
--

CREATE TABLE sre_mexican_tramits_system.company_email (
    id bigint NOT NULL,
    email character varying(250) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone
);


ALTER TABLE sre_mexican_tramits_system.company_email OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 25104)
-- Name: company_email_app_config; Type: TABLE; Schema: sre_mexican_tramits_system; Owner: postgres
--

CREATE TABLE sre_mexican_tramits_system.company_email_app_config (
    id bigint NOT NULL,
    company_email_id bigint NOT NULL,
    server character varying(250) NOT NULL,
    port integer NOT NULL,
    password character varying(250) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone
);


ALTER TABLE sre_mexican_tramits_system.company_email_app_config OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 25103)
-- Name: company_email_app_config_id_seq; Type: SEQUENCE; Schema: sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE sre_mexican_tramits_system.company_email_app_config ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME sre_mexican_tramits_system.company_email_app_config_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 230 (class 1259 OID 16838)
-- Name: company_email_by_company; Type: TABLE; Schema: sre_mexican_tramits_system; Owner: postgres
--

CREATE TABLE sre_mexican_tramits_system.company_email_by_company (
    id bigint NOT NULL,
    company_id bigint NOT NULL,
    company_email_id bigint NOT NULL
);


ALTER TABLE sre_mexican_tramits_system.company_email_by_company OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16837)
-- Name: company_email_by_company_id_seq; Type: SEQUENCE; Schema: sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE sre_mexican_tramits_system.company_email_by_company ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME sre_mexican_tramits_system.company_email_by_company_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 227 (class 1259 OID 16828)
-- Name: company_email_id_seq; Type: SEQUENCE; Schema: sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE sre_mexican_tramits_system.company_email ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME sre_mexican_tramits_system.company_email_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 221 (class 1259 OID 16802)
-- Name: company_id_seq; Type: SEQUENCE; Schema: sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE sre_mexican_tramits_system.company ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME sre_mexican_tramits_system.company_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 238 (class 1259 OID 25184)
-- Name: payment; Type: TABLE; Schema: sre_mexican_tramits_system; Owner: postgres
--

CREATE TABLE sre_mexican_tramits_system.payment (
    id bigint NOT NULL,
    company_id bigint,
    payment_from_email_id bigint,
    holder character varying(250) NOT NULL,
    ammount numeric(20,2) NOT NULL,
    paid_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone,
    created_by bigint NOT NULL
);


ALTER TABLE sre_mexican_tramits_system.payment OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 16891)
-- Name: payment_email; Type: TABLE; Schema: sre_mexican_tramits_system; Owner: postgres
--

CREATE TABLE sre_mexican_tramits_system.payment_email (
    id bigint NOT NULL,
    email character varying(250) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone
);


ALTER TABLE sre_mexican_tramits_system.payment_email OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 25158)
-- Name: payment_email_by_company; Type: TABLE; Schema: sre_mexican_tramits_system; Owner: postgres
--

CREATE TABLE sre_mexican_tramits_system.payment_email_by_company (
    id bigint NOT NULL,
    company_id bigint NOT NULL,
    payment_email_id bigint NOT NULL
);


ALTER TABLE sre_mexican_tramits_system.payment_email_by_company OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 25157)
-- Name: payment_email_by_company_id_seq; Type: SEQUENCE; Schema: sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE sre_mexican_tramits_system.payment_email_by_company ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME sre_mexican_tramits_system.payment_email_by_company_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 231 (class 1259 OID 16890)
-- Name: payment_email_id_seq; Type: SEQUENCE; Schema: sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE sre_mexican_tramits_system.payment_email ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME sre_mexican_tramits_system.payment_email_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 240 (class 1259 OID 25191)
-- Name: payment_from_email; Type: TABLE; Schema: sre_mexican_tramits_system; Owner: postgres
--

CREATE TABLE sre_mexican_tramits_system.payment_from_email (
    id bigint NOT NULL,
    payment_email_id bigint NOT NULL,
    company_email_id bigint NOT NULL,
    company_id bigint,
    payment_id bigint,
    subject character varying,
    text character varying,
    html character varying,
    sender_name character varying(250) NOT NULL,
    ammount numeric(20,2) NOT NULL,
    paid_at timestamp without time zone,
    confirmed_at timestamp without time zone,
    confirmed_by bigint,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone
);


ALTER TABLE sre_mexican_tramits_system.payment_from_email OWNER TO postgres;

--
-- TOC entry 4130 (class 0 OID 0)
-- Dependencies: 240
-- Name: TABLE payment_from_email; Type: COMMENT; Schema: sre_mexican_tramits_system; Owner: postgres
--

COMMENT ON TABLE sre_mexican_tramits_system.payment_from_email IS '- Si el campo confirmed_at es nulo, también lo debe ser el campo payment_id.
  - Si el campo confirmed_at no es nulo y tampoco lo es el campo payment_id, entonces el pago registrado desde el correo ya se convirtió en pago.
  - Si el campo confirmed_at no es nulo pero sí lo es el campo payment_id, entonces el pago fue rechazado y no registrado como pago.';


--
-- TOC entry 239 (class 1259 OID 25190)
-- Name: payment_from_email_id_seq; Type: SEQUENCE; Schema: sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE sre_mexican_tramits_system.payment_from_email ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME sre_mexican_tramits_system.payment_from_email_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 237 (class 1259 OID 25183)
-- Name: payment_id_seq; Type: SEQUENCE; Schema: sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE sre_mexican_tramits_system.payment ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME sre_mexican_tramits_system.payment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 224 (class 1259 OID 16812)
-- Name: user; Type: TABLE; Schema: sre_mexican_tramits_system; Owner: postgres
--

CREATE TABLE sre_mexican_tramits_system."user" (
    id bigint NOT NULL,
    email character varying(250) NOT NULL,
    password character varying(1000) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone
);


ALTER TABLE sre_mexican_tramits_system."user" OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16823)
-- Name: user_by_company; Type: TABLE; Schema: sre_mexican_tramits_system; Owner: postgres
--

CREATE TABLE sre_mexican_tramits_system.user_by_company (
    id bigint NOT NULL,
    company_id bigint NOT NULL,
    user_id bigint NOT NULL
);


ALTER TABLE sre_mexican_tramits_system.user_by_company OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16822)
-- Name: user_by_company_id_seq; Type: SEQUENCE; Schema: sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE sre_mexican_tramits_system.user_by_company ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME sre_mexican_tramits_system.user_by_company_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 223 (class 1259 OID 16811)
-- Name: user_id_seq; Type: SEQUENCE; Schema: sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE sre_mexican_tramits_system."user" ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME sre_mexican_tramits_system.user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 256 (class 1259 OID 25460)
-- Name: TEMP_unit_measurement; Type: TABLE; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

CREATE TABLE system_structure_sre_mexican_tramits_system."TEMP_unit_measurement" (
    id bigint NOT NULL,
    category character varying(50) DEFAULT NULL::character varying,
    type character varying(50) DEFAULT NULL::character varying,
    subtype character varying(50) DEFAULT NULL::character varying,
    unit_measurement character varying(250) DEFAULT NULL::character varying,
    symbol character varying(250) DEFAULT NULL::character varying,
    value character varying(250) DEFAULT NULL::character varying,
    "numericValue" character varying(250) DEFAULT NULL::character varying,
    category_id bigint,
    type_id bigint,
    subtype_id bigint,
    unit_measurement_category_id bigint
);


ALTER TABLE system_structure_sre_mexican_tramits_system."TEMP_unit_measurement" OWNER TO postgres;

--
-- TOC entry 4131 (class 0 OID 0)
-- Dependencies: 256
-- Name: TABLE "TEMP_unit_measurement"; Type: COMMENT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

COMMENT ON TABLE system_structure_sre_mexican_tramits_system."TEMP_unit_measurement" IS 'Es una tabla temporal no necesaria.';


--
-- TOC entry 258 (class 1259 OID 25475)
-- Name: TEMP_unit_measurement_category; Type: TABLE; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

CREATE TABLE system_structure_sre_mexican_tramits_system."TEMP_unit_measurement_category" (
    id bigint NOT NULL,
    unit_measurement_category_id bigint,
    category character varying(100) NOT NULL,
    annulled_at timestamp without time zone,
    annulled_by bigint
);


ALTER TABLE system_structure_sre_mexican_tramits_system."TEMP_unit_measurement_category" OWNER TO postgres;

--
-- TOC entry 4132 (class 0 OID 0)
-- Dependencies: 258
-- Name: TABLE "TEMP_unit_measurement_category"; Type: COMMENT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

COMMENT ON TABLE system_structure_sre_mexican_tramits_system."TEMP_unit_measurement_category" IS 'Es una tabla temporal no necesaria.';


--
-- TOC entry 257 (class 1259 OID 25474)
-- Name: TEMP_unit_measurement_category_id_seq; Type: SEQUENCE; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE system_structure_sre_mexican_tramits_system."TEMP_unit_measurement_category" ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME system_structure_sre_mexican_tramits_system."TEMP_unit_measurement_category_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 255 (class 1259 OID 25459)
-- Name: TEMP_unit_measurement_id_seq; Type: SEQUENCE; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE system_structure_sre_mexican_tramits_system."TEMP_unit_measurement" ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME system_structure_sre_mexican_tramits_system."TEMP_unit_measurement_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 241 (class 1259 OID 25282)
-- Name: entity; Type: TABLE; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

CREATE TABLE system_structure_sre_mexican_tramits_system.entity (
    is_natural bit(1) DEFAULT '1'::"bit" NOT NULL,
    name character varying NOT NULL COLLATE system_structure_sre_mexican_tramits_system.case_insensitive,
    gender system_structure_sre_mexican_tramits_system.entity_gender_enum,
    date_birth timestamp without time zone,
    address character varying DEFAULT NULL::character varying COLLATE system_structure_sre_mexican_tramits_system.case_insensitive,
    photo character varying DEFAULT NULL::character varying COLLATE system_structure_sre_mexican_tramits_system.case_insensitive,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    inactivated_at timestamp without time zone,
    updated_at timestamp without time zone,
    annulled_at timestamp without time zone,
    annulled_by uuid,
    created_by uuid,
    inactivated_by uuid,
    updated_by uuid,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    document_id uuid
);


ALTER TABLE system_structure_sre_mexican_tramits_system.entity OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 25357)
-- Name: entity_document; Type: TABLE; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

CREATE TABLE system_structure_sre_mexican_tramits_system.entity_document (
    document character varying DEFAULT NULL::character varying COLLATE system_structure_sre_mexican_tramits_system.case_insensitive,
    "order" integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    annulled_at timestamp without time zone,
    annulled_by uuid,
    created_by uuid,
    entity_document_category_id uuid,
    entity_id uuid,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE system_structure_sre_mexican_tramits_system.entity_document OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 25373)
-- Name: entity_document_category; Type: TABLE; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

CREATE TABLE system_structure_sre_mexican_tramits_system.entity_document_category (
    city_id bigint,
    state_id bigint,
    country_id bigint,
    category character varying NOT NULL COLLATE system_structure_sre_mexican_tramits_system.case_insensitive,
    symbol character varying DEFAULT NULL::character varying COLLATE system_structure_sre_mexican_tramits_system.case_insensitive,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    annulled_at timestamp without time zone,
    annulled_by uuid,
    created_by uuid,
    parent_id uuid,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE system_structure_sre_mexican_tramits_system.entity_document_category OWNER TO postgres;

--
-- TOC entry 264 (class 1259 OID 37919)
-- Name: entity_documents_by_entity; Type: VIEW; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

CREATE VIEW system_structure_sre_mexican_tramits_system.entity_documents_by_entity AS
 SELECT ed.entity_id,
    json_agg(json_build_object('id', ed.id, 'entity_document_category_id', ed.entity_document_category_id, 'entity_id', ed.entity_id, 'entity_document_id', ed.id, 'city_id', edc.city_id, 'state_id', edc.state_id, 'country_id', edc.country_id, 'document', ed.document, 'category', edc.category, 'symbol', edc.symbol, 'order', ed."order") ORDER BY ed."order") AS documents,
    count(DISTINCT concat(ed.entity_id, '-', ed.id)) AS quantity
   FROM (system_structure_sre_mexican_tramits_system.entity_document ed
     JOIN system_structure_sre_mexican_tramits_system.entity_document_category edc ON ((edc.id = ed.entity_document_category_id)))
  WHERE ((ed.annulled_at IS NULL) AND (edc.annulled_at IS NULL))
  GROUP BY ed.entity_id;


ALTER VIEW system_structure_sre_mexican_tramits_system.entity_documents_by_entity OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 25381)
-- Name: entity_email; Type: TABLE; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

CREATE TABLE system_structure_sre_mexican_tramits_system.entity_email (
    email character varying NOT NULL COLLATE system_structure_sre_mexican_tramits_system.case_insensitive,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone,
    annulled_at timestamp without time zone,
    annulled_by uuid,
    created_by uuid,
    updated_by uuid,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE system_structure_sre_mexican_tramits_system.entity_email OWNER TO postgres;

--
-- TOC entry 246 (class 1259 OID 25387)
-- Name: entity_email_by_entity; Type: TABLE; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

CREATE TABLE system_structure_sre_mexican_tramits_system.entity_email_by_entity (
    "order" integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    annulled_at timestamp without time zone,
    annulled_by uuid,
    created_by uuid,
    entity_email_id uuid,
    entity_id uuid,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE system_structure_sre_mexican_tramits_system.entity_email_by_entity OWNER TO postgres;

--
-- TOC entry 265 (class 1259 OID 37924)
-- Name: entity_emails_concat; Type: VIEW; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

CREATE VIEW system_structure_sre_mexican_tramits_system.entity_emails_concat AS
 SELECT eee.entity_id,
    json_agg(ee.email ORDER BY eee."order") AS emails
   FROM (system_structure_sre_mexican_tramits_system.entity_email ee
     JOIN system_structure_sre_mexican_tramits_system.entity_email_by_entity eee ON ((eee.entity_email_id = ee.id)))
  WHERE ((ee.annulled_at IS NULL) AND (eee.annulled_at IS NULL))
  GROUP BY eee.entity_id;


ALTER VIEW system_structure_sre_mexican_tramits_system.entity_emails_concat OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 25395)
-- Name: entity_name; Type: TABLE; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

CREATE TABLE system_structure_sre_mexican_tramits_system.entity_name (
    name character varying NOT NULL COLLATE system_structure_sre_mexican_tramits_system.case_insensitive,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone,
    annulled_at timestamp without time zone,
    annulled_by uuid,
    created_by uuid,
    updated_by uuid,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE system_structure_sre_mexican_tramits_system.entity_name OWNER TO postgres;

--
-- TOC entry 248 (class 1259 OID 25401)
-- Name: entity_name_by_entity; Type: TABLE; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

CREATE TABLE system_structure_sre_mexican_tramits_system.entity_name_by_entity (
    order_type integer DEFAULT 0 NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    annulled_at timestamp without time zone,
    annulled_by uuid,
    created_by uuid,
    entity_id uuid,
    entity_name_id uuid,
    entity_name_type_id uuid,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE system_structure_sre_mexican_tramits_system.entity_name_by_entity OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 25410)
-- Name: entity_name_type; Type: TABLE; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

CREATE TABLE system_structure_sre_mexican_tramits_system.entity_name_type (
    type system_structure_sre_mexican_tramits_system.entity_name_type_type_enum,
    apply_to_natural integer DEFAULT 0 NOT NULL,
    apply_to_legal integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone,
    annulled_at timestamp without time zone,
    annulled_by uuid,
    created_by uuid,
    updated_by uuid,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE system_structure_sre_mexican_tramits_system.entity_name_type OWNER TO postgres;

--
-- TOC entry 263 (class 1259 OID 37914)
-- Name: entity_names_concat_by_type; Type: VIEW; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

CREATE VIEW system_structure_sre_mexican_tramits_system.entity_names_concat_by_type AS
 SELECT ene.entity_id,
    ent.type,
    string_agg((name.name)::text, ' '::text ORDER BY ene."order") AS name
   FROM ((system_structure_sre_mexican_tramits_system.entity_name_by_entity ene
     JOIN system_structure_sre_mexican_tramits_system.entity_name_type ent ON ((ent.id = ene.entity_name_type_id)))
     JOIN system_structure_sre_mexican_tramits_system.entity_name name ON ((name.id = ene.entity_name_id)))
  WHERE ((ene.annulled_at IS NULL) AND (name.annulled_at IS NULL))
  GROUP BY ene.entity_id, ent.type;


ALTER VIEW system_structure_sre_mexican_tramits_system.entity_names_concat_by_type OWNER TO postgres;

--
-- TOC entry 250 (class 1259 OID 25419)
-- Name: entity_phone; Type: TABLE; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

CREATE TABLE system_structure_sre_mexican_tramits_system.entity_phone (
    phone character varying NOT NULL COLLATE system_structure_sre_mexican_tramits_system.case_insensitive,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone,
    annulled_at timestamp without time zone,
    annulled_by uuid,
    created_by uuid,
    updated_by uuid,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE system_structure_sre_mexican_tramits_system.entity_phone OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 25425)
-- Name: entity_phone_by_entity; Type: TABLE; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

CREATE TABLE system_structure_sre_mexican_tramits_system.entity_phone_by_entity (
    "order" integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    annulled_at timestamp without time zone,
    annulled_by uuid,
    created_by uuid,
    entity_id uuid,
    entity_phone_id uuid,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE system_structure_sre_mexican_tramits_system.entity_phone_by_entity OWNER TO postgres;

--
-- TOC entry 266 (class 1259 OID 37929)
-- Name: entity_phones_concat; Type: VIEW; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

CREATE VIEW system_structure_sre_mexican_tramits_system.entity_phones_concat AS
 SELECT epe.entity_id,
    json_agg(ep.phone ORDER BY epe."order") AS phones
   FROM (system_structure_sre_mexican_tramits_system.entity_phone ep
     JOIN system_structure_sre_mexican_tramits_system.entity_phone_by_entity epe ON ((epe.entity_phone_id = ep.id)))
  WHERE ((ep.annulled_at IS NULL) AND (epe.annulled_at IS NULL))
  GROUP BY epe.entity_id;


ALTER VIEW system_structure_sre_mexican_tramits_system.entity_phones_concat OWNER TO postgres;

--
-- TOC entry 252 (class 1259 OID 25433)
-- Name: system; Type: TABLE; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

CREATE TABLE system_structure_sre_mexican_tramits_system.system (
    key_name character varying NOT NULL COLLATE system_structure_sre_mexican_tramits_system.case_insensitive,
    name character varying NOT NULL COLLATE system_structure_sre_mexican_tramits_system.case_insensitive,
    logo character varying DEFAULT NULL::character varying COLLATE system_structure_sre_mexican_tramits_system.case_insensitive,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    inactivated_at timestamp without time zone,
    updated_at timestamp without time zone,
    annulled_at timestamp without time zone,
    inactivated_by uuid,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE system_structure_sre_mexican_tramits_system.system OWNER TO postgres;

--
-- TOC entry 253 (class 1259 OID 25443)
-- Name: system_subscription; Type: TABLE; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

CREATE TABLE system_structure_sre_mexican_tramits_system.system_subscription (
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    inactivated_at timestamp without time zone,
    updated_at timestamp without time zone,
    annulled_at timestamp without time zone,
    annulled_by uuid,
    created_by uuid,
    entity_id uuid,
    inactivated_by uuid,
    system_id uuid,
    updated_by uuid,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE system_structure_sre_mexican_tramits_system.system_subscription OWNER TO postgres;

--
-- TOC entry 254 (class 1259 OID 25450)
-- Name: system_subscription_user; Type: TABLE; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

CREATE TABLE system_structure_sre_mexican_tramits_system.system_subscription_user (
    username character varying DEFAULT NULL::character varying COLLATE system_structure_sre_mexican_tramits_system.case_insensitive,
    password character varying NOT NULL COLLATE system_structure_sre_mexican_tramits_system.case_insensitive,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    inactivated_at timestamp without time zone,
    annulled_at timestamp without time zone,
    annulled_by uuid,
    created_by uuid,
    entity_id uuid,
    inactivated_by uuid,
    system_subscription_id uuid,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE system_structure_sre_mexican_tramits_system.system_subscription_user OWNER TO postgres;

--
-- TOC entry 261 (class 1259 OID 37905)
-- Name: view_entity_names_by_type_obj; Type: VIEW; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

CREATE VIEW system_structure_sre_mexican_tramits_system.view_entity_names_by_type_obj AS
 SELECT ene.entity_id,
    ene.entity_name_type_id,
    max(ene.order_type) AS order_type,
    ent.type,
    json_agg(en.name ORDER BY ene.order_type, ene."order", en.name) AS names
   FROM ((system_structure_sre_mexican_tramits_system.entity_name_by_entity ene
     JOIN system_structure_sre_mexican_tramits_system.entity_name_type ent ON ((ent.id = ene.entity_name_type_id)))
     JOIN system_structure_sre_mexican_tramits_system.entity_name en ON ((en.id = ene.entity_name_id)))
  WHERE ((ene.annulled_at IS NULL) AND (en.annulled_at IS NULL))
  GROUP BY ene.entity_id, ene.entity_name_type_id, ent.type;


ALTER VIEW system_structure_sre_mexican_tramits_system.view_entity_names_by_type_obj OWNER TO postgres;

--
-- TOC entry 262 (class 1259 OID 37910)
-- Name: view_entity_names_object; Type: VIEW; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

CREATE VIEW system_structure_sre_mexican_tramits_system.view_entity_names_object AS
 SELECT entity_id,
    json_agg(json_build_object('entity_name_type_id', entity_name_type_id, 'order', order_type, 'type', type, 'names', names) ORDER BY order_type) AS types
   FROM system_structure_sre_mexican_tramits_system.view_entity_names_by_type_obj ento
  GROUP BY entity_id;


ALTER VIEW system_structure_sre_mexican_tramits_system.view_entity_names_object OWNER TO postgres;

--
-- TOC entry 267 (class 1259 OID 37934)
-- Name: system_subscription_user_complete_info; Type: VIEW; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

CREATE VIEW system_structure_sre_mexican_tramits_system.system_subscription_user_complete_info AS
 SELECT ssu.id,
    ss.system_id,
    ssu.system_subscription_id,
    ssu.entity_id,
    ssu.id AS system_subscription_user_id,
    ssu.username,
    ssu.password,
    ent.name,
    system_structure_sre_mexican_tramits_system.iif((names_obj.types IS NULL), NULL::character varying, (names_obj.types)::character varying) AS names_obj,
    TRIM(BOTH FROM concat(system_structure_sre_mexican_tramits_system.iif((names.name IS NULL), ''::text, names.name), ' ', system_structure_sre_mexican_tramits_system.iif((surnames.name IS NULL), ''::text, surnames.name))) AS complete_name,
    names.name AS names,
    surnames.name AS surnames,
    system_structure_sre_mexican_tramits_system.iif((COALESCE(ede.quantity, (0)::bigint) < 1), NULL::character varying, (ede.documents)::character varying) AS documents,
    system_structure_sre_mexican_tramits_system.iif((epc.phones IS NULL), NULL::character varying, (epc.phones)::character varying) AS phones,
    system_structure_sre_mexican_tramits_system.iif((eec.emails IS NULL), NULL::character varying, (eec.emails)::character varying) AS emails,
    ent.photo,
    system_structure_sre_mexican_tramits_system.iif((ssu.created_by IS NULL), 1, 0) AS is_admin,
    sys.inactivated_at AS inactivated_at_system,
    ss.inactivated_at AS inactivated_at_system_subscription,
    ssu.inactivated_at AS inactivated_at_system_subscription_user,
    ss.inactivated_by AS inactivated_by_system_subscription,
    ssu.inactivated_by AS inactivated_by_system_subscription_user,
    LEAST(sys.inactivated_at, ss.inactivated_at, ssu.inactivated_at) AS inactivated_at,
        CASE
            WHEN ((ss.inactivated_at IS NOT NULL) AND (ss.inactivated_at = LEAST(sys.inactivated_at, ss.inactivated_at, ssu.inactivated_at))) THEN ss.inactivated_at
            WHEN ((ssu.inactivated_at IS NOT NULL) AND (ssu.inactivated_at = LEAST(sys.inactivated_at, ss.inactivated_at, ssu.inactivated_at))) THEN ssu.inactivated_at
            ELSE NULL::timestamp without time zone
        END AS inactivated_by,
    sys.annulled_at AS annulled_at_system,
    ss.annulled_at AS annulled_at_system_subscription,
    ssu.annulled_at AS annulled_at_system_subscription_user,
    ss.annulled_by AS annulled_by_system_subscription,
    ssu.annulled_by AS annulled_by_system_subscription_user,
    LEAST(sys.annulled_at, ss.annulled_at, ssu.annulled_at) AS annulled_at,
        CASE
            WHEN ((ss.annulled_at IS NOT NULL) AND (ss.annulled_at = LEAST(sys.annulled_at, ss.annulled_at, ssu.annulled_at))) THEN ss.annulled_at
            WHEN ((ssu.annulled_at IS NOT NULL) AND (ssu.annulled_at = LEAST(sys.annulled_at, ss.annulled_at, ssu.annulled_at))) THEN ssu.annulled_at
            ELSE NULL::timestamp without time zone
        END AS annulled_by
   FROM (((((((((system_structure_sre_mexican_tramits_system.system_subscription_user ssu
     JOIN system_structure_sre_mexican_tramits_system.system_subscription ss ON ((ss.id = ssu.system_subscription_id)))
     JOIN system_structure_sre_mexican_tramits_system.system sys ON ((sys.id = ss.system_id)))
     JOIN system_structure_sre_mexican_tramits_system.entity ent ON ((ent.id = ssu.entity_id)))
     LEFT JOIN system_structure_sre_mexican_tramits_system.entity_documents_by_entity ede ON ((ede.entity_id = ssu.entity_id)))
     LEFT JOIN system_structure_sre_mexican_tramits_system.entity_names_concat_by_type names ON (((names.entity_id = ent.id) AND (names.type = 'Name'::system_structure_sre_mexican_tramits_system.entity_name_type_type_enum))))
     LEFT JOIN system_structure_sre_mexican_tramits_system.view_entity_names_object names_obj ON ((names_obj.entity_id = ssu.entity_id)))
     LEFT JOIN system_structure_sre_mexican_tramits_system.entity_names_concat_by_type surnames ON (((surnames.entity_id = ent.id) AND (surnames.type = 'Surname'::system_structure_sre_mexican_tramits_system.entity_name_type_type_enum))))
     LEFT JOIN system_structure_sre_mexican_tramits_system.entity_phones_concat epc ON ((epc.entity_id = ent.id)))
     LEFT JOIN system_structure_sre_mexican_tramits_system.entity_emails_concat eec ON ((eec.entity_id = ent.id)))
  WHERE ((ss.annulled_at IS NULL) AND (sys.annulled_at IS NULL) AND (ssu.annulled_at IS NULL) AND (ent.annulled_at IS NULL));


ALTER VIEW system_structure_sre_mexican_tramits_system.system_subscription_user_complete_info OWNER TO postgres;

--
-- TOC entry 268 (class 1259 OID 37950)
-- Name: entity_complete_info; Type: VIEW; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

CREATE VIEW system_structure_sre_mexican_tramits_system.entity_complete_info AS
 SELECT ent.id,
    ent.document_id,
    ent.is_natural,
    ent.name,
    ent.gender,
    ent.date_birth,
    ent.address,
    ent.photo,
    ent.created_at,
    ent.created_by,
    ent.updated_at,
    ent.updated_by,
    ent.annulled_at,
    ent.annulled_by,
        CASE
            WHEN (ent.is_natural = '1'::"bit") THEN (TRIM(BOTH FROM concat(system_structure_sre_mexican_tramits_system.iif((names.name IS NULL), ''::text, names.name), ' ', system_structure_sre_mexican_tramits_system.iif((surnames.name IS NULL), ''::text, surnames.name))))::character varying
            ELSE COALESCE(name.name, business_name.name, comercial_designation.name)
        END AS complete_name,
    system_structure_sre_mexican_tramits_system.iif((names_obj.types IS NULL), NULL::json, names_obj.types) AS names_obj,
    names.name AS names,
    system_structure_sre_mexican_tramits_system.iif((ent.is_natural = '1'::"bit"), surnames.name, NULL::text) AS surnames,
    system_structure_sre_mexican_tramits_system.iif((ent.is_natural = '1'::"bit"), NULL::character varying, name.name) AS legal_name,
    system_structure_sre_mexican_tramits_system.iif((ent.is_natural = '1'::"bit"), NULL::character varying, business_name.name) AS business_name,
    system_structure_sre_mexican_tramits_system.iif((ent.is_natural = '1'::"bit"), NULL::character varying, comercial_designation.name) AS comercial_designation,
    system_structure_sre_mexican_tramits_system.iif((COALESCE(ede.quantity, (0)::bigint) < 1), NULL::json, ede.documents) AS documents,
    system_structure_sre_mexican_tramits_system.iif((epc.phones IS NULL), NULL::json, epc.phones) AS phones,
    system_structure_sre_mexican_tramits_system.iif((eec.emails IS NULL), NULL::json, eec.emails) AS emails,
    ssu.system_id,
    ssu.system_subscription_id,
    ssu.system_subscription_user_id
   FROM ((((((((((system_structure_sre_mexican_tramits_system.entity ent
     JOIN system_structure_sre_mexican_tramits_system.system_subscription_user_complete_info ssu ON ((((ent.created_by IS NOT NULL) AND (ssu.system_subscription_user_id = ent.created_by)) OR ((ent.created_by IS NULL) AND (ssu.entity_id = ent.id)))))
     LEFT JOIN system_structure_sre_mexican_tramits_system.entity_documents_by_entity ede ON ((ede.entity_id = ent.id)))
     LEFT JOIN system_structure_sre_mexican_tramits_system.view_entity_names_object names_obj ON ((names_obj.entity_id = ent.id)))
     LEFT JOIN system_structure_sre_mexican_tramits_system.entity_names_concat_by_type names ON (((names.entity_id = ent.id) AND (names.type = 'Name'::system_structure_sre_mexican_tramits_system.entity_name_type_type_enum))))
     LEFT JOIN system_structure_sre_mexican_tramits_system.entity_names_concat_by_type surnames ON (((surnames.entity_id = ent.id) AND (surnames.type = 'Surname'::system_structure_sre_mexican_tramits_system.entity_name_type_type_enum))))
     LEFT JOIN ( SELECT ene.entity_id,
            ene.entity_name_type_id,
            ene.entity_name_id,
            first_value(en.id) OVER (PARTITION BY ene.entity_id, ene.entity_name_type_id ORDER BY ene."order", ene.created_at, en.name) AS selected_entity_name_id,
            en.name
           FROM ((system_structure_sre_mexican_tramits_system.entity_name en
             JOIN system_structure_sre_mexican_tramits_system.entity_name_by_entity ene ON ((ene.entity_name_id = en.id)))
             JOIN system_structure_sre_mexican_tramits_system.entity_name_type ety ON ((ety.id = ene.entity_name_type_id)))
          WHERE ((en.annulled_at IS NULL) AND (ene.annulled_at IS NULL) AND (ety.type = 'Name'::system_structure_sre_mexican_tramits_system.entity_name_type_type_enum))) name ON (((name.entity_id = ent.id) AND (name.entity_name_id = name.selected_entity_name_id))))
     LEFT JOIN ( SELECT ene.entity_id,
            ene.entity_name_type_id,
            ene.entity_name_id,
            first_value(en.id) OVER (PARTITION BY ene.entity_id, ene.entity_name_type_id ORDER BY ene."order", ene.created_at, en.name) AS selected_entity_name_id,
            en.name
           FROM ((system_structure_sre_mexican_tramits_system.entity_name en
             JOIN system_structure_sre_mexican_tramits_system.entity_name_by_entity ene ON ((ene.entity_name_id = en.id)))
             JOIN system_structure_sre_mexican_tramits_system.entity_name_type ety ON ((ety.id = ene.entity_name_type_id)))
          WHERE ((en.annulled_at IS NULL) AND (ene.annulled_at IS NULL) AND (ety.type = 'Business Name'::system_structure_sre_mexican_tramits_system.entity_name_type_type_enum))) business_name ON (((business_name.entity_id = ent.id) AND (business_name.entity_name_id = business_name.selected_entity_name_id))))
     LEFT JOIN ( SELECT ene.entity_id,
            ene.entity_name_type_id,
            ene.entity_name_id,
            first_value(en.id) OVER (PARTITION BY ene.entity_id, ene.entity_name_type_id ORDER BY ene."order", ene.created_at, en.name) AS selected_entity_name_id,
            en.name
           FROM ((system_structure_sre_mexican_tramits_system.entity_name en
             JOIN system_structure_sre_mexican_tramits_system.entity_name_by_entity ene ON ((ene.entity_name_id = en.id)))
             JOIN system_structure_sre_mexican_tramits_system.entity_name_type ety ON ((ety.id = ene.entity_name_type_id)))
          WHERE ((en.annulled_at IS NULL) AND (ene.annulled_at IS NULL) AND (ety.type = 'Comercial Designation'::system_structure_sre_mexican_tramits_system.entity_name_type_type_enum))) comercial_designation ON (((comercial_designation.entity_id = ent.id) AND (comercial_designation.entity_name_id = comercial_designation.selected_entity_name_id))))
     LEFT JOIN system_structure_sre_mexican_tramits_system.entity_phones_concat epc ON ((epc.entity_id = ent.id)))
     LEFT JOIN system_structure_sre_mexican_tramits_system.entity_emails_concat eec ON ((eec.entity_id = ent.id)));


ALTER VIEW system_structure_sre_mexican_tramits_system.entity_complete_info OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 25365)
-- Name: entity_document_by_entity; Type: TABLE; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

CREATE TABLE system_structure_sre_mexican_tramits_system.entity_document_by_entity (
    "order" integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    annulled_at timestamp without time zone,
    annulled_by uuid,
    created_by uuid,
    entity_document_id uuid,
    entity_id uuid,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE system_structure_sre_mexican_tramits_system.entity_document_by_entity OWNER TO postgres;

--
-- TOC entry 270 (class 1259 OID 38048)
-- Name: entity_relation; Type: TABLE; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

CREATE TABLE system_structure_sre_mexican_tramits_system.entity_relation (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    entity_id uuid NOT NULL,
    entity_related_id uuid NOT NULL,
    entity_type_relation_id uuid NOT NULL,
    is_parent boolean DEFAULT false NOT NULL,
    is_child boolean DEFAULT false NOT NULL,
    is_parallel boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_by uuid NOT NULL,
    updated_at timestamp without time zone,
    updated_by uuid,
    annulled_at timestamp without time zone,
    annulled_by uuid
);


ALTER TABLE system_structure_sre_mexican_tramits_system.entity_relation OWNER TO postgres;

--
-- TOC entry 271 (class 1259 OID 38058)
-- Name: entity_type; Type: TABLE; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

CREATE TABLE system_structure_sre_mexican_tramits_system.entity_type (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    type character varying(255) NOT NULL,
    code character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_by uuid NOT NULL,
    updated_at timestamp without time zone,
    updated_by uuid,
    annulled_at timestamp without time zone,
    annulled_by uuid,
    is_hierarchical boolean DEFAULT false NOT NULL,
    applies_to_natural boolean DEFAULT false NOT NULL,
    applies_to_legal boolean DEFAULT false NOT NULL,
    is_required_for_system boolean DEFAULT false NOT NULL,
    description character varying(2500)
);


ALTER TABLE system_structure_sre_mexican_tramits_system.entity_type OWNER TO postgres;

--
-- TOC entry 269 (class 1259 OID 38041)
-- Name: entity_type_by_entity; Type: TABLE; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

CREATE TABLE system_structure_sre_mexican_tramits_system.entity_type_by_entity (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    entity_id uuid NOT NULL,
    entity_type_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_by uuid NOT NULL,
    updated_at timestamp without time zone,
    updated_by uuid,
    annulled_at timestamp without time zone,
    annulled_by uuid
);


ALTER TABLE system_structure_sre_mexican_tramits_system.entity_type_by_entity OWNER TO postgres;

--
-- TOC entry 273 (class 1259 OID 38215)
-- Name: entity_type_hierarchy; Type: TABLE; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

CREATE TABLE system_structure_sre_mexican_tramits_system.entity_type_hierarchy (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    entity_type_id uuid NOT NULL,
    entity_type_parent_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_by uuid NOT NULL,
    updated_at timestamp without time zone,
    updated_by uuid,
    annulled_at timestamp without time zone,
    annulled_by uuid
);


ALTER TABLE system_structure_sre_mexican_tramits_system.entity_type_hierarchy OWNER TO postgres;

--
-- TOC entry 272 (class 1259 OID 38069)
-- Name: entity_type_relation; Type: TABLE; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

CREATE TABLE system_structure_sre_mexican_tramits_system.entity_type_relation (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    entity_type_id uuid NOT NULL,
    entity_type_related_id uuid NOT NULL,
    is_parallel boolean DEFAULT false NOT NULL,
    is_required_parallel boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_by uuid NOT NULL,
    updated_at timestamp without time zone,
    updated_by uuid,
    annulled_at timestamp without time zone,
    annulled_by uuid,
    is_also boolean DEFAULT false NOT NULL,
    is_also_required boolean DEFAULT false NOT NULL
);


ALTER TABLE system_structure_sre_mexican_tramits_system.entity_type_relation OWNER TO postgres;

--
-- TOC entry 259 (class 1259 OID 25481)
-- Name: unit_measurement; Type: TABLE; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

CREATE TABLE system_structure_sre_mexican_tramits_system.unit_measurement (
    unit_measurement character varying NOT NULL COLLATE system_structure_sre_mexican_tramits_system.case_insensitive,
    symbol character varying DEFAULT NULL::character varying COLLATE system_structure_sre_mexican_tramits_system.case_insensitive,
    value character varying NOT NULL COLLATE system_structure_sre_mexican_tramits_system.case_insensitive,
    numeric_value character varying DEFAULT NULL::character varying COLLATE system_structure_sre_mexican_tramits_system.case_insensitive,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone,
    annulled_at timestamp without time zone,
    annulled_by uuid,
    created_by uuid,
    unit_measurement_base_id uuid,
    unit_measurement_category_id uuid,
    updated_by uuid,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE system_structure_sre_mexican_tramits_system.unit_measurement OWNER TO postgres;

--
-- TOC entry 260 (class 1259 OID 25492)
-- Name: unit_measurement_category; Type: TABLE; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

CREATE TABLE system_structure_sre_mexican_tramits_system.unit_measurement_category (
    category character varying NOT NULL COLLATE system_structure_sre_mexican_tramits_system.case_insensitive,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone,
    annulled_at timestamp without time zone,
    old_parent_id bigint,
    old_id bigint NOT NULL,
    annulled_by uuid,
    created_by uuid,
    parent_id uuid,
    system_subscription_id uuid,
    updated_by uuid,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE system_structure_sre_mexican_tramits_system.unit_measurement_category OWNER TO postgres;

--
-- TOC entry 4133 (class 0 OID 0)
-- Dependencies: 260
-- Name: COLUMN unit_measurement_category.old_parent_id; Type: COMMENT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

COMMENT ON COLUMN system_structure_sre_mexican_tramits_system.unit_measurement_category.old_parent_id IS 'campo eliminable. Solo está temporalmente para manejar data.';


--
-- TOC entry 4134 (class 0 OID 0)
-- Dependencies: 260
-- Name: COLUMN unit_measurement_category.old_id; Type: COMMENT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

COMMENT ON COLUMN system_structure_sre_mexican_tramits_system.unit_measurement_category.old_id IS 'campo eliminable. Solo está temporalmente para manejar data.';


--
-- TOC entry 274 (class 1259 OID 46462)
-- Name: view_recursive_entity_type_hierarchy; Type: VIEW; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

CREATE VIEW system_structure_sre_mexican_tramits_system.view_recursive_entity_type_hierarchy AS
 WITH RECURSIVE recursive_entity_type_hierarchy AS (
         SELECT et.id AS root_id,
            ((json_build_object((0)::character varying, et.id))::character varying)::jsonb AS hierarchical_route,
            0 AS level,
            NULL::uuid AS parent_id,
            et.id
           FROM system_structure_sre_mexican_tramits_system.entity_type et
          WHERE ((et.annulled_at IS NULL) AND (NOT (EXISTS ( SELECT eth.id
                   FROM system_structure_sre_mexican_tramits_system.entity_type_hierarchy eth
                  WHERE ((eth.entity_type_id = et.id) AND (eth.annulled_at IS NULL))))))
        UNION ALL
         SELECT reth.root_id,
            (reth.hierarchical_route || ((json_build_object(((reth.level + 1))::character varying, et.id))::character varying)::jsonb) AS hierarchical_route,
            (reth.level + 1) AS level,
            reth.id AS parent_id,
            et.id
           FROM ((system_structure_sre_mexican_tramits_system.entity_type et
             JOIN system_structure_sre_mexican_tramits_system.entity_type_hierarchy eth ON (((eth.entity_type_id = et.id) AND (eth.annulled_at IS NULL))))
             JOIN recursive_entity_type_hierarchy reth ON ((reth.id = eth.entity_type_parent_id)))
          WHERE (et.annulled_at IS NULL)
        )
 SELECT root_id,
    hierarchical_route,
    level,
    parent_id,
    id
   FROM recursive_entity_type_hierarchy;


ALTER VIEW system_structure_sre_mexican_tramits_system.view_recursive_entity_type_hierarchy OWNER TO postgres;

--
-- TOC entry 4077 (class 0 OID 16803)
-- Dependencies: 222
-- Data for Name: company; Type: TABLE DATA; Schema: sre_mexican_tramits_system; Owner: postgres
--

COPY sre_mexican_tramits_system.company (id, company, created_at) FROM stdin;
3	Proheredes	2025-04-09 10:20:24.420068
\.


--
-- TOC entry 4083 (class 0 OID 16829)
-- Dependencies: 228
-- Data for Name: company_email; Type: TABLE DATA; Schema: sre_mexican_tramits_system; Owner: postgres
--

COPY sre_mexican_tramits_system.company_email (id, email, created_at, updated_at) FROM stdin;
1	proheredes@gmail.com	2025-04-09 10:20:27.986007	\N
\.


--
-- TOC entry 4089 (class 0 OID 25104)
-- Dependencies: 234
-- Data for Name: company_email_app_config; Type: TABLE DATA; Schema: sre_mexican_tramits_system; Owner: postgres
--

COPY sre_mexican_tramits_system.company_email_app_config (id, company_email_id, server, port, password, created_at, updated_at) FROM stdin;
1	1	imap.gmail.com	993	vkefuzrwfchbfswq	2025-04-11 11:52:28.759081	\N
\.


--
-- TOC entry 4085 (class 0 OID 16838)
-- Dependencies: 230
-- Data for Name: company_email_by_company; Type: TABLE DATA; Schema: sre_mexican_tramits_system; Owner: postgres
--

COPY sre_mexican_tramits_system.company_email_by_company (id, company_id, company_email_id) FROM stdin;
2	3	1
\.


--
-- TOC entry 4093 (class 0 OID 25184)
-- Dependencies: 238
-- Data for Name: payment; Type: TABLE DATA; Schema: sre_mexican_tramits_system; Owner: postgres
--

COPY sre_mexican_tramits_system.payment (id, company_id, payment_from_email_id, holder, ammount, paid_at, created_at, updated_at, created_by) FROM stdin;
\.


--
-- TOC entry 4087 (class 0 OID 16891)
-- Dependencies: 232
-- Data for Name: payment_email; Type: TABLE DATA; Schema: sre_mexican_tramits_system; Owner: postgres
--

COPY sre_mexican_tramits_system.payment_email (id, email, created_at, updated_at) FROM stdin;
1	nolascomalave@hotmail.com	2025-04-09 10:22:02.957073	\N
\.


--
-- TOC entry 4091 (class 0 OID 25158)
-- Dependencies: 236
-- Data for Name: payment_email_by_company; Type: TABLE DATA; Schema: sre_mexican_tramits_system; Owner: postgres
--

COPY sre_mexican_tramits_system.payment_email_by_company (id, company_id, payment_email_id) FROM stdin;
\.


--
-- TOC entry 4095 (class 0 OID 25191)
-- Dependencies: 240
-- Data for Name: payment_from_email; Type: TABLE DATA; Schema: sre_mexican_tramits_system; Owner: postgres
--

COPY sre_mexican_tramits_system.payment_from_email (id, payment_email_id, company_email_id, company_id, payment_id, subject, text, html, sender_name, ammount, paid_at, confirmed_at, confirmed_by, created_at, updated_at) FROM stdin;
1	1	1	\N	\N	RV: You received a payment from # Nolasco Malave $5,200.00	Ejemplo de Pago.	<html>\n<head>\n<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">\n<style type="text/css" style="display:none;"> P {margin-top:0;margin-bottom:0;} </style>\n</head>\n<body dir="ltr">\n<div class="elementToProof" style="font-family: &quot;Times New Roman&quot;, Times, serif; font-size: 14pt; color: rgb(0, 0, 0);">\nEjemplo de Pago.</div>\n<div id="x_x_Signature" class="x_x_elementToProof">\n<div style="font-size:12pt;color:#000000;font-family:Calibri,Helvetica,sans-serif" id="x_x_divtagdefaultwrapper" dir="ltr">\n</div>\n</div>\n<div class="x_x_x_elementToProof" id="x_x_x_Signature">\n<div style="font-size:12pt;color:#000000;font-family:Calibri,Helvetica,sans-serif" dir="ltr" id="x_x_x_divtagdefaultwrapper">\n</div>\n</div>\n</body>\n</html>	Nolasco Malave	5200.00	2025-04-11 21:06:00	\N	\N	2025-04-11 21:06:20.727	\N
\.


--
-- TOC entry 4079 (class 0 OID 16812)
-- Dependencies: 224
-- Data for Name: user; Type: TABLE DATA; Schema: sre_mexican_tramits_system; Owner: postgres
--

COPY sre_mexican_tramits_system."user" (id, email, password, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4081 (class 0 OID 16823)
-- Dependencies: 226
-- Data for Name: user_by_company; Type: TABLE DATA; Schema: sre_mexican_tramits_system; Owner: postgres
--

COPY sre_mexican_tramits_system.user_by_company (id, company_id, user_id) FROM stdin;
\.


--
-- TOC entry 4111 (class 0 OID 25460)
-- Dependencies: 256
-- Data for Name: TEMP_unit_measurement; Type: TABLE DATA; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

COPY system_structure_sre_mexican_tramits_system."TEMP_unit_measurement" (id, category, type, subtype, unit_measurement, symbol, value, "numericValue", category_id, type_id, subtype_id, unit_measurement_category_id) FROM stdin;
\.


--
-- TOC entry 4113 (class 0 OID 25475)
-- Dependencies: 258
-- Data for Name: TEMP_unit_measurement_category; Type: TABLE DATA; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

COPY system_structure_sre_mexican_tramits_system."TEMP_unit_measurement_category" (id, unit_measurement_category_id, category, annulled_at, annulled_by) FROM stdin;
\.


--
-- TOC entry 4096 (class 0 OID 25282)
-- Dependencies: 241
-- Data for Name: entity; Type: TABLE DATA; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

COPY system_structure_sre_mexican_tramits_system.entity (is_natural, name, gender, date_birth, address, photo, created_at, inactivated_at, updated_at, annulled_at, annulled_by, created_by, inactivated_by, updated_by, id, document_id) FROM stdin;
0	SRE Mexican Tramits System	\N	\N	\N	\N	2025-04-25 16:28:27.752663	\N	\N	\N	\N	\N	\N	\N	fe97a328-74eb-40cb-81f1-dda16291c0d1	\N
1	Nolasco Rafael Castro Malavé	Male	\N	Urbanización Brisas Del Mar, Sector 5, Calle 10, Vereda 5000\r\nCasa 5	\N	2025-04-25 23:25:11.236	\N	2025-04-25 23:26:16.176	\N	\N	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	\N	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	b4cefcf4-03e2-473c-a1c5-5c12a02050fe	87224bbd-c83e-489b-a112-5c7c699e0374
\.


--
-- TOC entry 4097 (class 0 OID 25357)
-- Dependencies: 242
-- Data for Name: entity_document; Type: TABLE DATA; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

COPY system_structure_sre_mexican_tramits_system.entity_document (document, "order", created_at, annulled_at, annulled_by, created_by, entity_document_category_id, entity_id, id) FROM stdin;
2351351444	2	2025-04-25 23:26:16.147	\N	\N	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	9fd37314-7624-4f8d-b6f0-610fe66f10b3	b4cefcf4-03e2-473c-a1c5-5c12a02050fe	87224bbd-c83e-489b-a112-5c7c699e0374
2351351444	2	2025-04-25 23:25:11.236	2025-04-25 23:26:16.341	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	9fd37314-7624-4f8d-b6f0-610fe66f10b3	b4cefcf4-03e2-473c-a1c5-5c12a02050fe	d9507d45-f743-49b3-8f6a-4135e68c57d5
\.


--
-- TOC entry 4098 (class 0 OID 25365)
-- Dependencies: 243
-- Data for Name: entity_document_by_entity; Type: TABLE DATA; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

COPY system_structure_sre_mexican_tramits_system.entity_document_by_entity ("order", created_at, annulled_at, annulled_by, created_by, entity_document_id, entity_id, id) FROM stdin;
\.


--
-- TOC entry 4099 (class 0 OID 25373)
-- Dependencies: 244
-- Data for Name: entity_document_category; Type: TABLE DATA; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

COPY system_structure_sre_mexican_tramits_system.entity_document_category (city_id, state_id, country_id, category, symbol, created_at, annulled_at, annulled_by, created_by, parent_id, id) FROM stdin;
\N	\N	\N	Social Security Number	SSN	2025-04-25 18:15:23.634078	\N	\N	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	\N	9fd37314-7624-4f8d-b6f0-610fe66f10b3
\.


--
-- TOC entry 4100 (class 0 OID 25381)
-- Dependencies: 245
-- Data for Name: entity_email; Type: TABLE DATA; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

COPY system_structure_sre_mexican_tramits_system.entity_email (email, created_at, updated_at, annulled_at, annulled_by, created_by, updated_by, id) FROM stdin;
nolascomalave@hotmail.com	2025-04-25 23:25:11.236	\N	\N	\N	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	\N	e6ac363e-6867-469f-9296-9f678719fa0f
\.


--
-- TOC entry 4101 (class 0 OID 25387)
-- Dependencies: 246
-- Data for Name: entity_email_by_entity; Type: TABLE DATA; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

COPY system_structure_sre_mexican_tramits_system.entity_email_by_entity ("order", created_at, annulled_at, annulled_by, created_by, entity_email_id, entity_id, id) FROM stdin;
1	2025-04-25 23:25:11.236	\N	\N	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	e6ac363e-6867-469f-9296-9f678719fa0f	b4cefcf4-03e2-473c-a1c5-5c12a02050fe	633e6a91-c49d-4fab-af50-d97aa83c7439
\.


--
-- TOC entry 4102 (class 0 OID 25395)
-- Dependencies: 247
-- Data for Name: entity_name; Type: TABLE DATA; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

COPY system_structure_sre_mexican_tramits_system.entity_name (name, created_at, updated_at, annulled_at, annulled_by, created_by, updated_by, id) FROM stdin;
SRE Mexican Tramits System	2025-04-25 16:33:24.38675	\N	\N	\N	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	\N	bb697add-2858-4360-88df-717c1693d297
Nolasco	2025-04-25 23:25:11.236	\N	\N	\N	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	\N	76159dee-cdf5-471e-8d2b-35acc2eb8612
Rafael	2025-04-25 23:25:11.236	\N	\N	\N	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	\N	e94749d8-e128-4618-81a4-6ef6a963eb22
Castro	2025-04-25 23:25:11.236	\N	\N	\N	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	\N	ec4afa3e-8b85-4525-9b63-cbb1abef61bf
Malavé	2025-04-25 23:25:11.236	\N	\N	\N	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	\N	b4b2cf46-a15e-45a6-96e0-ec7c42d21779
\.


--
-- TOC entry 4103 (class 0 OID 25401)
-- Dependencies: 248
-- Data for Name: entity_name_by_entity; Type: TABLE DATA; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

COPY system_structure_sre_mexican_tramits_system.entity_name_by_entity (order_type, "order", created_at, annulled_at, annulled_by, created_by, entity_id, entity_name_id, entity_name_type_id, id) FROM stdin;
1	1	2025-04-25 16:37:20.962725	\N	\N	\N	fe97a328-74eb-40cb-81f1-dda16291c0d1	bb697add-2858-4360-88df-717c1693d297	ac1aa044-0c4f-4275-b045-f7e8acb145a6	c3c0898a-6787-4824-9bd7-cca1502d6617
0	1	2025-04-25 23:25:11.236	\N	\N	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	b4cefcf4-03e2-473c-a1c5-5c12a02050fe	76159dee-cdf5-471e-8d2b-35acc2eb8612	ac1aa044-0c4f-4275-b045-f7e8acb145a6	969b7723-e173-4188-9215-71715e21bccc
0	1	2025-04-25 23:25:11.236	\N	\N	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	b4cefcf4-03e2-473c-a1c5-5c12a02050fe	e94749d8-e128-4618-81a4-6ef6a963eb22	ac1aa044-0c4f-4275-b045-f7e8acb145a6	a360c664-9f1d-44cd-bece-822b27f62996
0	1	2025-04-25 23:25:11.236	\N	\N	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	b4cefcf4-03e2-473c-a1c5-5c12a02050fe	ec4afa3e-8b85-4525-9b63-cbb1abef61bf	35aff730-b9ff-4428-9c5f-81d53fdb3cdf	1085296e-f3f5-4010-a7cf-5364b9274d6c
0	1	2025-04-25 23:25:11.236	\N	\N	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	b4cefcf4-03e2-473c-a1c5-5c12a02050fe	b4b2cf46-a15e-45a6-96e0-ec7c42d21779	35aff730-b9ff-4428-9c5f-81d53fdb3cdf	5548c996-9f1d-440d-a04e-9a953b9bb505
\.


--
-- TOC entry 4104 (class 0 OID 25410)
-- Dependencies: 249
-- Data for Name: entity_name_type; Type: TABLE DATA; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

COPY system_structure_sre_mexican_tramits_system.entity_name_type (type, apply_to_natural, apply_to_legal, created_at, updated_at, annulled_at, annulled_by, created_by, updated_by, id) FROM stdin;
Name	1	1	2025-04-25 16:35:31.568549	\N	\N	\N	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	\N	ac1aa044-0c4f-4275-b045-f7e8acb145a6
Surname	1	0	2025-04-25 16:35:31.568549	\N	\N	\N	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	\N	35aff730-b9ff-4428-9c5f-81d53fdb3cdf
Alias	1	1	2025-04-25 16:35:31.568549	\N	\N	\N	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	\N	b561d6f1-22f7-4cf3-ad64-300c3d51d219
Business Name	0	1	2025-04-25 16:35:31.568549	\N	\N	\N	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	\N	0c5c9652-c01f-4f7d-a65a-d9f14672e18a
Comercial Designation	0	1	2025-04-25 16:35:31.568549	\N	\N	\N	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	\N	ffa74293-684f-45db-a88e-cf1d5660426d
\.


--
-- TOC entry 4105 (class 0 OID 25419)
-- Dependencies: 250
-- Data for Name: entity_phone; Type: TABLE DATA; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

COPY system_structure_sre_mexican_tramits_system.entity_phone (phone, created_at, updated_at, annulled_at, annulled_by, created_by, updated_by, id) FROM stdin;
584123161687	2025-04-25 23:25:11.236	\N	\N	\N	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	\N	b127a07f-df37-45d6-b3d5-9542dc9ca873
\.


--
-- TOC entry 4106 (class 0 OID 25425)
-- Dependencies: 251
-- Data for Name: entity_phone_by_entity; Type: TABLE DATA; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

COPY system_structure_sre_mexican_tramits_system.entity_phone_by_entity ("order", created_at, annulled_at, annulled_by, created_by, entity_id, entity_phone_id, id) FROM stdin;
1	2025-04-25 23:25:11.236	\N	\N	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	b4cefcf4-03e2-473c-a1c5-5c12a02050fe	b127a07f-df37-45d6-b3d5-9542dc9ca873	d0142f57-44ea-4d67-9c1d-2bae54b9cca8
\.


--
-- TOC entry 4117 (class 0 OID 38048)
-- Dependencies: 270
-- Data for Name: entity_relation; Type: TABLE DATA; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

COPY system_structure_sre_mexican_tramits_system.entity_relation (id, entity_id, entity_related_id, entity_type_relation_id, is_parent, is_child, is_parallel, created_at, created_by, updated_at, updated_by, annulled_at, annulled_by) FROM stdin;
\.


--
-- TOC entry 4118 (class 0 OID 38058)
-- Dependencies: 271
-- Data for Name: entity_type; Type: TABLE DATA; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

COPY system_structure_sre_mexican_tramits_system.entity_type (id, type, code, created_at, created_by, updated_at, updated_by, annulled_at, annulled_by, is_hierarchical, applies_to_natural, applies_to_legal, is_required_for_system, description) FROM stdin;
b27f4572-f06e-4394-896a-bc932b2e161e	System Subscription	SYSSU	2025-05-08 14:20:44.623907	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	\N	\N	\N	\N	f	f	t	t	\N
38fc11b2-ec87-4bfa-8bed-8d9788103359	Organizational Structure	OS	2025-05-08 14:20:44.623907	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	\N	\N	\N	\N	t	f	t	t	\N
3a29f72d-70cd-40c9-a39e-51cd1d1469da	Organizational Position Type	OPT	2025-05-08 14:20:44.623907	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	\N	\N	\N	\N	t	f	t	t	\N
16b7cdb7-8084-4265-ba37-5181432ea8d9	Organizational Position 	OP	2025-05-08 14:20:44.623907	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	\N	\N	\N	\N	t	f	t	t	\N
eb7a3b2e-6701-468d-accd-51e5d5947381	Employee	WORKER	2025-05-08 14:21:09.237623	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	\N	\N	\N	\N	f	t	f	t	\N
3837383e-51a7-421c-993d-e54aa2d8214a	Space / Location	SPLO	2025-05-08 14:21:09.237623	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	\N	\N	\N	\N	t	f	t	f	\N
7cf5d3f3-efb7-4b4e-b78d-e1adbe4e619d	Company	OS-COMP	2025-05-12 09:51:46.263437	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	\N	\N	\N	\N	f	f	f	f	\N
6ee0fe5d-b318-4338-adc1-7d8ec213cbf0	Branch	OS-BRANCH	2025-05-12 09:51:46.263437	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	\N	\N	\N	\N	f	f	f	f	\N
f630169e-42e6-4567-8651-8d31665331a4	Management	OS-MANA	2025-05-12 09:51:46.263437	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	\N	\N	\N	\N	f	f	f	f	\N
6e588e5f-4c75-468c-9939-bcbc0cedfac3	Superintendence	OS-SUPIN	2025-05-12 09:51:46.263437	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	\N	\N	\N	\N	f	f	f	f	\N
38363e2c-5f59-4fa5-b504-0c98a4fe147b	Department	OS-DEPT	2025-05-12 09:51:46.263437	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	\N	\N	\N	\N	f	f	f	f	\N
\.


--
-- TOC entry 4116 (class 0 OID 38041)
-- Dependencies: 269
-- Data for Name: entity_type_by_entity; Type: TABLE DATA; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

COPY system_structure_sre_mexican_tramits_system.entity_type_by_entity (id, entity_id, entity_type_id, created_at, created_by, updated_at, updated_by, annulled_at, annulled_by) FROM stdin;
5f36b5b0-01cd-4632-9c1e-adfdbf4f1271	fe97a328-74eb-40cb-81f1-dda16291c0d1	b27f4572-f06e-4394-896a-bc932b2e161e	2025-05-08 18:07:57.89631	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	\N	\N	\N	\N
9955b3f7-87db-49ea-8569-3d1cc0db68aa	fe97a328-74eb-40cb-81f1-dda16291c0d1	38fc11b2-ec87-4bfa-8bed-8d9788103359	2025-05-08 18:07:57.89631	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	\N	\N	\N	\N
57c0dc73-56b7-46a1-a4c4-5f692c0d1480	b4cefcf4-03e2-473c-a1c5-5c12a02050fe	eb7a3b2e-6701-468d-accd-51e5d5947381	2025-05-08 18:07:57.89631	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	\N	\N	\N	\N
\.


--
-- TOC entry 4120 (class 0 OID 38215)
-- Dependencies: 273
-- Data for Name: entity_type_hierarchy; Type: TABLE DATA; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

COPY system_structure_sre_mexican_tramits_system.entity_type_hierarchy (id, entity_type_id, entity_type_parent_id, created_at, created_by, updated_at, updated_by, annulled_at, annulled_by) FROM stdin;
bf76d29b-167a-47e0-9a7d-ded9d8c138c7	7cf5d3f3-efb7-4b4e-b78d-e1adbe4e619d	38fc11b2-ec87-4bfa-8bed-8d9788103359	2025-05-12 09:54:11.501919	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	\N	\N	\N	\N
085c3d15-bbb7-4609-93db-d4a838f4bd91	6ee0fe5d-b318-4338-adc1-7d8ec213cbf0	7cf5d3f3-efb7-4b4e-b78d-e1adbe4e619d	2025-05-12 09:54:11.501919	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	\N	\N	\N	\N
a20c6f3e-c84c-4fe9-bae9-1f193e587659	f630169e-42e6-4567-8651-8d31665331a4	7cf5d3f3-efb7-4b4e-b78d-e1adbe4e619d	2025-05-12 09:54:11.501919	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	\N	\N	\N	\N
000f7509-a9cc-4e83-a101-a32028e71126	f630169e-42e6-4567-8651-8d31665331a4	6ee0fe5d-b318-4338-adc1-7d8ec213cbf0	2025-05-12 09:54:11.501919	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	\N	\N	\N	\N
d815bf20-a31e-4b28-98f6-4fb5294b06e6	6e588e5f-4c75-468c-9939-bcbc0cedfac3	f630169e-42e6-4567-8651-8d31665331a4	2025-05-12 09:54:11.501919	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	\N	\N	\N	\N
d3957be1-9fb5-4463-9c8f-711f5ac06075	38363e2c-5f59-4fa5-b504-0c98a4fe147b	f630169e-42e6-4567-8651-8d31665331a4	2025-05-12 09:54:11.501919	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	\N	\N	\N	\N
92853f3b-cb40-4c81-80d7-ef5f413a024b	38363e2c-5f59-4fa5-b504-0c98a4fe147b	6e588e5f-4c75-468c-9939-bcbc0cedfac3	2025-05-12 09:54:11.501919	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	\N	\N	\N	\N
\.


--
-- TOC entry 4119 (class 0 OID 38069)
-- Dependencies: 272
-- Data for Name: entity_type_relation; Type: TABLE DATA; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

COPY system_structure_sre_mexican_tramits_system.entity_type_relation (id, entity_type_id, entity_type_related_id, is_parallel, is_required_parallel, created_at, created_by, updated_at, updated_by, annulled_at, annulled_by, is_also, is_also_required) FROM stdin;
3e4df3f6-8956-4884-9002-eddbceda9a33	38fc11b2-ec87-4bfa-8bed-8d9788103359	3837383e-51a7-421c-993d-e54aa2d8214a	t	f	2025-05-08 17:50:45.502207	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	\N	\N	\N	\N	f	f
1687d5c7-de1e-4962-b57b-9b3b1c7aeb50	3837383e-51a7-421c-993d-e54aa2d8214a	38fc11b2-ec87-4bfa-8bed-8d9788103359	t	f	2025-05-08 17:50:45.502207	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	\N	\N	\N	\N	f	f
77d3a40d-e777-45dd-a368-65bd35c5af34	16b7cdb7-8084-4265-ba37-5181432ea8d9	38fc11b2-ec87-4bfa-8bed-8d9788103359	t	t	2025-05-08 18:01:53.936055	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	\N	\N	\N	\N	f	f
a37da408-12f3-4885-8bab-fad80140a8fc	38fc11b2-ec87-4bfa-8bed-8d9788103359	16b7cdb7-8084-4265-ba37-5181432ea8d9	t	f	2025-05-08 18:01:53.94026	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	\N	\N	\N	\N	f	f
25aca45b-e10c-449e-ab0b-d5371312c464	16b7cdb7-8084-4265-ba37-5181432ea8d9	eb7a3b2e-6701-468d-accd-51e5d5947381	t	f	2025-05-08 18:10:28.241899	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	\N	\N	\N	\N	f	f
ff9f0c8e-51af-4c10-a7c1-93c2f0819dac	eb7a3b2e-6701-468d-accd-51e5d5947381	16b7cdb7-8084-4265-ba37-5181432ea8d9	t	f	2025-05-08 18:10:28.241899	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	\N	\N	\N	\N	f	f
726cb5e3-c71b-442e-badd-6a06a7881eea	b27f4572-f06e-4394-896a-bc932b2e161e	38fc11b2-ec87-4bfa-8bed-8d9788103359	f	f	2025-05-08 17:50:45.502207	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	\N	\N	\N	\N	t	t
8f7f6140-5f82-4b53-ab95-dffd21a3a8ca	38fc11b2-ec87-4bfa-8bed-8d9788103359	b27f4572-f06e-4394-896a-bc932b2e161e	f	f	2025-05-08 17:50:45.502207	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	\N	\N	\N	\N	t	f
31cf07cb-8044-4761-91a5-66e0fb17249e	16b7cdb7-8084-4265-ba37-5181432ea8d9	3a29f72d-70cd-40c9-a39e-51cd1d1469da	f	f	2025-05-08 18:00:56.406369	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	\N	\N	\N	\N	t	t
31042719-316c-4991-b7bc-2c3a762bd1dc	3a29f72d-70cd-40c9-a39e-51cd1d1469da	16b7cdb7-8084-4265-ba37-5181432ea8d9	f	f	2025-05-08 18:00:56.418578	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	\N	\N	\N	\N	t	f
\.


--
-- TOC entry 4107 (class 0 OID 25433)
-- Dependencies: 252
-- Data for Name: system; Type: TABLE DATA; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

COPY system_structure_sre_mexican_tramits_system.system (key_name, name, logo, created_at, inactivated_at, updated_at, annulled_at, inactivated_by, id) FROM stdin;
SRE	SRE Mexican Tramits System	\N	2025-04-25 16:22:17.121533	\N	\N	\N	\N	7d9b5c9b-6430-4bdb-9c48-36a2722048ed
\.


--
-- TOC entry 4108 (class 0 OID 25443)
-- Dependencies: 253
-- Data for Name: system_subscription; Type: TABLE DATA; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

COPY system_structure_sre_mexican_tramits_system.system_subscription (created_at, inactivated_at, updated_at, annulled_at, annulled_by, created_by, entity_id, inactivated_by, system_id, updated_by, id) FROM stdin;
2025-04-25 16:29:00.148119	\N	\N	\N	\N	\N	fe97a328-74eb-40cb-81f1-dda16291c0d1	\N	7d9b5c9b-6430-4bdb-9c48-36a2722048ed	\N	f58a534f-853f-4ad1-9dac-5418763dc6c0
\.


--
-- TOC entry 4109 (class 0 OID 25450)
-- Dependencies: 254
-- Data for Name: system_subscription_user; Type: TABLE DATA; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

COPY system_structure_sre_mexican_tramits_system.system_subscription_user (username, password, created_at, inactivated_at, annulled_at, annulled_by, created_by, entity_id, inactivated_by, system_subscription_id, id) FROM stdin;
ADMIN	$2a$10$HFOUmPCjQTdr/RyF5PDyKeOKmkxHSQ8zjIldV1vGBvbPeXnHoy3/W	2025-04-25 16:31:59.294015	\N	\N	\N	\N	fe97a328-74eb-40cb-81f1-dda16291c0d1	\N	f58a534f-853f-4ad1-9dac-5418763dc6c0	21eac953-d55c-4ddb-bab1-d5e923d2ef3c
malaven	$2a$10$97B54SomDkXwyvZcwU0.cOQCdc./1.BxyVBMZ2pZxzKJ6p7SwR34W	2025-04-25 23:25:11.236	\N	\N	\N	21eac953-d55c-4ddb-bab1-d5e923d2ef3c	b4cefcf4-03e2-473c-a1c5-5c12a02050fe	\N	f58a534f-853f-4ad1-9dac-5418763dc6c0	38443093-0c3f-4f0d-bf40-b9c2805d8f3c
\.


--
-- TOC entry 4114 (class 0 OID 25481)
-- Dependencies: 259
-- Data for Name: unit_measurement; Type: TABLE DATA; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

COPY system_structure_sre_mexican_tramits_system.unit_measurement (unit_measurement, symbol, value, numeric_value, created_at, updated_at, annulled_at, annulled_by, created_by, unit_measurement_base_id, unit_measurement_category_id, updated_by, id) FROM stdin;
\.


--
-- TOC entry 4115 (class 0 OID 25492)
-- Dependencies: 260
-- Data for Name: unit_measurement_category; Type: TABLE DATA; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

COPY system_structure_sre_mexican_tramits_system.unit_measurement_category (category, created_at, updated_at, annulled_at, old_parent_id, old_id, annulled_by, created_by, parent_id, system_subscription_id, updated_by, id) FROM stdin;
\.


--
-- TOC entry 4135 (class 0 OID 0)
-- Dependencies: 233
-- Name: company_email_app_config_id_seq; Type: SEQUENCE SET; Schema: sre_mexican_tramits_system; Owner: postgres
--

SELECT pg_catalog.setval('sre_mexican_tramits_system.company_email_app_config_id_seq', 1, true);


--
-- TOC entry 4136 (class 0 OID 0)
-- Dependencies: 229
-- Name: company_email_by_company_id_seq; Type: SEQUENCE SET; Schema: sre_mexican_tramits_system; Owner: postgres
--

SELECT pg_catalog.setval('sre_mexican_tramits_system.company_email_by_company_id_seq', 2, true);


--
-- TOC entry 4137 (class 0 OID 0)
-- Dependencies: 227
-- Name: company_email_id_seq; Type: SEQUENCE SET; Schema: sre_mexican_tramits_system; Owner: postgres
--

SELECT pg_catalog.setval('sre_mexican_tramits_system.company_email_id_seq', 1, true);


--
-- TOC entry 4138 (class 0 OID 0)
-- Dependencies: 221
-- Name: company_id_seq; Type: SEQUENCE SET; Schema: sre_mexican_tramits_system; Owner: postgres
--

SELECT pg_catalog.setval('sre_mexican_tramits_system.company_id_seq', 3, true);


--
-- TOC entry 4139 (class 0 OID 0)
-- Dependencies: 235
-- Name: payment_email_by_company_id_seq; Type: SEQUENCE SET; Schema: sre_mexican_tramits_system; Owner: postgres
--

SELECT pg_catalog.setval('sre_mexican_tramits_system.payment_email_by_company_id_seq', 1, false);


--
-- TOC entry 4140 (class 0 OID 0)
-- Dependencies: 231
-- Name: payment_email_id_seq; Type: SEQUENCE SET; Schema: sre_mexican_tramits_system; Owner: postgres
--

SELECT pg_catalog.setval('sre_mexican_tramits_system.payment_email_id_seq', 1, true);


--
-- TOC entry 4141 (class 0 OID 0)
-- Dependencies: 239
-- Name: payment_from_email_id_seq; Type: SEQUENCE SET; Schema: sre_mexican_tramits_system; Owner: postgres
--

SELECT pg_catalog.setval('sre_mexican_tramits_system.payment_from_email_id_seq', 1, true);


--
-- TOC entry 4142 (class 0 OID 0)
-- Dependencies: 237
-- Name: payment_id_seq; Type: SEQUENCE SET; Schema: sre_mexican_tramits_system; Owner: postgres
--

SELECT pg_catalog.setval('sre_mexican_tramits_system.payment_id_seq', 1, false);


--
-- TOC entry 4143 (class 0 OID 0)
-- Dependencies: 225
-- Name: user_by_company_id_seq; Type: SEQUENCE SET; Schema: sre_mexican_tramits_system; Owner: postgres
--

SELECT pg_catalog.setval('sre_mexican_tramits_system.user_by_company_id_seq', 1, false);


--
-- TOC entry 4144 (class 0 OID 0)
-- Dependencies: 223
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: sre_mexican_tramits_system; Owner: postgres
--

SELECT pg_catalog.setval('sre_mexican_tramits_system.user_id_seq', 1, false);


--
-- TOC entry 4145 (class 0 OID 0)
-- Dependencies: 257
-- Name: TEMP_unit_measurement_category_id_seq; Type: SEQUENCE SET; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

SELECT pg_catalog.setval('system_structure_sre_mexican_tramits_system."TEMP_unit_measurement_category_id_seq"', 1, false);


--
-- TOC entry 4146 (class 0 OID 0)
-- Dependencies: 255
-- Name: TEMP_unit_measurement_id_seq; Type: SEQUENCE SET; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

SELECT pg_catalog.setval('system_structure_sre_mexican_tramits_system."TEMP_unit_measurement_id_seq"', 1, false);


--
-- TOC entry 3739 (class 2606 OID 16810)
-- Name: company company_company_key; Type: CONSTRAINT; Schema: sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY sre_mexican_tramits_system.company
    ADD CONSTRAINT company_company_key UNIQUE (company);


--
-- TOC entry 3762 (class 2606 OID 25111)
-- Name: company_email_app_config company_email_app_config_pkey; Type: CONSTRAINT; Schema: sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY sre_mexican_tramits_system.company_email_app_config
    ADD CONSTRAINT company_email_app_config_pkey PRIMARY KEY (id);


--
-- TOC entry 3755 (class 2606 OID 16842)
-- Name: company_email_by_company company_email_by_company_pkey; Type: CONSTRAINT; Schema: sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY sre_mexican_tramits_system.company_email_by_company
    ADD CONSTRAINT company_email_by_company_pkey PRIMARY KEY (id);


--
-- TOC entry 3750 (class 2606 OID 16836)
-- Name: company_email company_email_email_key; Type: CONSTRAINT; Schema: sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY sre_mexican_tramits_system.company_email
    ADD CONSTRAINT company_email_email_key UNIQUE (email);


--
-- TOC entry 3752 (class 2606 OID 16834)
-- Name: company_email company_email_pkey; Type: CONSTRAINT; Schema: sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY sre_mexican_tramits_system.company_email
    ADD CONSTRAINT company_email_pkey PRIMARY KEY (id);


--
-- TOC entry 3741 (class 2606 OID 16808)
-- Name: company company_pkey; Type: CONSTRAINT; Schema: sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY sre_mexican_tramits_system.company
    ADD CONSTRAINT company_pkey PRIMARY KEY (id);


--
-- TOC entry 3765 (class 2606 OID 25162)
-- Name: payment_email_by_company payment_email_by_company_pkey; Type: CONSTRAINT; Schema: sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY sre_mexican_tramits_system.payment_email_by_company
    ADD CONSTRAINT payment_email_by_company_pkey PRIMARY KEY (id);


--
-- TOC entry 3757 (class 2606 OID 16898)
-- Name: payment_email payment_email_email_key; Type: CONSTRAINT; Schema: sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY sre_mexican_tramits_system.payment_email
    ADD CONSTRAINT payment_email_email_key UNIQUE (email);


--
-- TOC entry 3759 (class 2606 OID 16896)
-- Name: payment_email payment_email_pkey; Type: CONSTRAINT; Schema: sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY sre_mexican_tramits_system.payment_email
    ADD CONSTRAINT payment_email_pkey PRIMARY KEY (id);


--
-- TOC entry 3769 (class 2606 OID 25200)
-- Name: payment_from_email payment_from_email_payment_id_key; Type: CONSTRAINT; Schema: sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY sre_mexican_tramits_system.payment_from_email
    ADD CONSTRAINT payment_from_email_payment_id_key UNIQUE (payment_id);


--
-- TOC entry 3771 (class 2606 OID 25198)
-- Name: payment_from_email payment_from_email_pkey; Type: CONSTRAINT; Schema: sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY sre_mexican_tramits_system.payment_from_email
    ADD CONSTRAINT payment_from_email_pkey PRIMARY KEY (id);


--
-- TOC entry 3767 (class 2606 OID 25189)
-- Name: payment payment_pkey; Type: CONSTRAINT; Schema: sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY sre_mexican_tramits_system.payment
    ADD CONSTRAINT payment_pkey PRIMARY KEY (id);


--
-- TOC entry 3748 (class 2606 OID 16827)
-- Name: user_by_company user_by_company_pkey; Type: CONSTRAINT; Schema: sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY sre_mexican_tramits_system.user_by_company
    ADD CONSTRAINT user_by_company_pkey PRIMARY KEY (id);


--
-- TOC entry 3743 (class 2606 OID 16821)
-- Name: user user_email_key; Type: CONSTRAINT; Schema: sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY sre_mexican_tramits_system."user"
    ADD CONSTRAINT user_email_key UNIQUE (email);


--
-- TOC entry 3745 (class 2606 OID 16819)
-- Name: user user_pkey; Type: CONSTRAINT; Schema: sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY sre_mexican_tramits_system."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- TOC entry 3800 (class 2606 OID 25479)
-- Name: TEMP_unit_measurement_category TEMP_unit_measurement_category_pkey; Type: CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system."TEMP_unit_measurement_category"
    ADD CONSTRAINT "TEMP_unit_measurement_category_pkey" PRIMARY KEY (id);


--
-- TOC entry 3798 (class 2606 OID 25473)
-- Name: TEMP_unit_measurement TEMP_unit_measurement_pkey; Type: CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system."TEMP_unit_measurement"
    ADD CONSTRAINT "TEMP_unit_measurement_pkey" PRIMARY KEY (id);


--
-- TOC entry 3777 (class 2606 OID 37493)
-- Name: entity_document_category entity_document_category_pkey; Type: CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_document_category
    ADD CONSTRAINT entity_document_category_pkey PRIMARY KEY (id);


--
-- TOC entry 3775 (class 2606 OID 37491)
-- Name: entity_document entity_document_pkey; Type: CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_document
    ADD CONSTRAINT entity_document_pkey PRIMARY KEY (id);


--
-- TOC entry 3780 (class 2606 OID 37495)
-- Name: entity_email entity_email_pkey; Type: CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_email
    ADD CONSTRAINT entity_email_pkey PRIMARY KEY (id);


--
-- TOC entry 3782 (class 2606 OID 37497)
-- Name: entity_name entity_name_pkey; Type: CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_name
    ADD CONSTRAINT entity_name_pkey PRIMARY KEY (id);


--
-- TOC entry 3785 (class 2606 OID 37499)
-- Name: entity_name_type entity_name_type_pkey; Type: CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_name_type
    ADD CONSTRAINT entity_name_type_pkey PRIMARY KEY (id);


--
-- TOC entry 3788 (class 2606 OID 37501)
-- Name: entity_phone entity_phone_pkey; Type: CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_phone
    ADD CONSTRAINT entity_phone_pkey PRIMARY KEY (id);


--
-- TOC entry 3773 (class 2606 OID 37489)
-- Name: entity entity_pkey; Type: CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity
    ADD CONSTRAINT entity_pkey PRIMARY KEY (id);


--
-- TOC entry 3811 (class 2606 OID 38057)
-- Name: entity_relation entity_relation_pkey; Type: CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_relation
    ADD CONSTRAINT entity_relation_pkey PRIMARY KEY (id);


--
-- TOC entry 3813 (class 2606 OID 38167)
-- Name: entity_relation entity_relation_unique; Type: CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_relation
    ADD CONSTRAINT entity_relation_unique UNIQUE (entity_id, entity_related_id);


--
-- TOC entry 3807 (class 2606 OID 38047)
-- Name: entity_type_by_entity entity_type_by_entity_pkey; Type: CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_type_by_entity
    ADD CONSTRAINT entity_type_by_entity_pkey PRIMARY KEY (id);


--
-- TOC entry 3809 (class 2606 OID 38135)
-- Name: entity_type_by_entity entity_type_by_entity_unique; Type: CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_type_by_entity
    ADD CONSTRAINT entity_type_by_entity_unique UNIQUE (entity_id, entity_type_id);


--
-- TOC entry 3815 (class 2606 OID 38068)
-- Name: entity_type entity_type_code_key; Type: CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_type
    ADD CONSTRAINT entity_type_code_key UNIQUE (code);


--
-- TOC entry 3823 (class 2606 OID 38221)
-- Name: entity_type_hierarchy entity_type_hierarchy_pkey; Type: CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_type_hierarchy
    ADD CONSTRAINT entity_type_hierarchy_pkey PRIMARY KEY (id);


--
-- TOC entry 3825 (class 2606 OID 38264)
-- Name: entity_type_hierarchy entity_type_hierarchy_unique; Type: CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_type_hierarchy
    ADD CONSTRAINT entity_type_hierarchy_unique UNIQUE (entity_type_id, entity_type_parent_id);


--
-- TOC entry 3817 (class 2606 OID 38066)
-- Name: entity_type entity_type_pkey; Type: CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_type
    ADD CONSTRAINT entity_type_pkey PRIMARY KEY (id);


--
-- TOC entry 3819 (class 2606 OID 38083)
-- Name: entity_type_relation entity_type_relation_pkey; Type: CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_type_relation
    ADD CONSTRAINT entity_type_relation_pkey PRIMARY KEY (id);


--
-- TOC entry 3821 (class 2606 OID 38214)
-- Name: entity_type_relation entity_type_relation_unique; Type: CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_type_relation
    ADD CONSTRAINT entity_type_relation_unique UNIQUE (entity_type_id, entity_type_related_id);


--
-- TOC entry 3792 (class 2606 OID 37503)
-- Name: system system_pkey; Type: CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.system
    ADD CONSTRAINT system_pkey PRIMARY KEY (id);


--
-- TOC entry 3794 (class 2606 OID 37505)
-- Name: system_subscription system_subscription_pkey; Type: CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.system_subscription
    ADD CONSTRAINT system_subscription_pkey PRIMARY KEY (id);


--
-- TOC entry 3796 (class 2606 OID 37507)
-- Name: system_subscription_user system_subscription_user_pkey; Type: CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.system_subscription_user
    ADD CONSTRAINT system_subscription_user_pkey PRIMARY KEY (id);


--
-- TOC entry 3805 (class 2606 OID 37511)
-- Name: unit_measurement_category unit_measurement_category_pkey; Type: CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.unit_measurement_category
    ADD CONSTRAINT unit_measurement_category_pkey PRIMARY KEY (id);


--
-- TOC entry 3803 (class 2606 OID 37509)
-- Name: unit_measurement unit_measurement_pkey; Type: CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.unit_measurement
    ADD CONSTRAINT unit_measurement_pkey PRIMARY KEY (id);


--
-- TOC entry 3760 (class 1259 OID 25112)
-- Name: company_email_app_config__unique; Type: INDEX; Schema: sre_mexican_tramits_system; Owner: postgres
--

CREATE UNIQUE INDEX company_email_app_config__unique ON sre_mexican_tramits_system.company_email_app_config USING btree (company_email_id, password);


--
-- TOC entry 3753 (class 1259 OID 16853)
-- Name: company_email_by_company__unique; Type: INDEX; Schema: sre_mexican_tramits_system; Owner: postgres
--

CREATE UNIQUE INDEX company_email_by_company__unique ON sre_mexican_tramits_system.company_email_by_company USING btree (company_id, company_email_id);


--
-- TOC entry 3763 (class 1259 OID 25163)
-- Name: payment_email_by_company__unique; Type: INDEX; Schema: sre_mexican_tramits_system; Owner: postgres
--

CREATE UNIQUE INDEX payment_email_by_company__unique ON sre_mexican_tramits_system.payment_email_by_company USING btree (company_id, payment_email_id);


--
-- TOC entry 3746 (class 1259 OID 16852)
-- Name: user_by_company__unique; Type: INDEX; Schema: sre_mexican_tramits_system; Owner: postgres
--

CREATE UNIQUE INDEX user_by_company__unique ON sre_mexican_tramits_system.user_by_company USING btree (company_id, user_id);


--
-- TOC entry 3778 (class 1259 OID 33602)
-- Name: email; Type: INDEX; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

CREATE UNIQUE INDEX email ON system_structure_sre_mexican_tramits_system.entity_email USING btree (email);


--
-- TOC entry 3790 (class 1259 OID 33595)
-- Name: key_name; Type: INDEX; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

CREATE UNIQUE INDEX key_name ON system_structure_sre_mexican_tramits_system.system USING btree (key_name);


--
-- TOC entry 3783 (class 1259 OID 33593)
-- Name: name; Type: INDEX; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

CREATE UNIQUE INDEX name ON system_structure_sre_mexican_tramits_system.entity_name USING btree (name);


--
-- TOC entry 3789 (class 1259 OID 33594)
-- Name: phone; Type: INDEX; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

CREATE UNIQUE INDEX phone ON system_structure_sre_mexican_tramits_system.entity_phone USING btree (phone);


--
-- TOC entry 3786 (class 1259 OID 25500)
-- Name: type; Type: INDEX; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

CREATE UNIQUE INDEX type ON system_structure_sre_mexican_tramits_system.entity_name_type USING btree (type);


--
-- TOC entry 3801 (class 1259 OID 25506)
-- Name: unit_measurement_category_pk1; Type: INDEX; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

CREATE UNIQUE INDEX unit_measurement_category_pk1 ON system_structure_sre_mexican_tramits_system."TEMP_unit_measurement_category" USING btree (unit_measurement_category_id, category);


--
-- TOC entry 3830 (class 2606 OID 25113)
-- Name: company_email_app_config company_email_app_config_company_email_id_fkey; Type: FK CONSTRAINT; Schema: sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY sre_mexican_tramits_system.company_email_app_config
    ADD CONSTRAINT company_email_app_config_company_email_id_fkey FOREIGN KEY (company_email_id) REFERENCES sre_mexican_tramits_system.company_email(id);


--
-- TOC entry 3828 (class 2606 OID 16869)
-- Name: company_email_by_company company_email_by_company_company_email_id_fkey; Type: FK CONSTRAINT; Schema: sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY sre_mexican_tramits_system.company_email_by_company
    ADD CONSTRAINT company_email_by_company_company_email_id_fkey FOREIGN KEY (company_email_id) REFERENCES sre_mexican_tramits_system.company_email(id);


--
-- TOC entry 3829 (class 2606 OID 16864)
-- Name: company_email_by_company company_email_by_company_company_id_fkey; Type: FK CONSTRAINT; Schema: sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY sre_mexican_tramits_system.company_email_by_company
    ADD CONSTRAINT company_email_by_company_company_id_fkey FOREIGN KEY (company_id) REFERENCES sre_mexican_tramits_system.company(id);


--
-- TOC entry 3833 (class 2606 OID 25201)
-- Name: payment payment_company_id_fkey; Type: FK CONSTRAINT; Schema: sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY sre_mexican_tramits_system.payment
    ADD CONSTRAINT payment_company_id_fkey FOREIGN KEY (company_id) REFERENCES sre_mexican_tramits_system.company(id);


--
-- TOC entry 3834 (class 2606 OID 25236)
-- Name: payment payment_created_by_fkey; Type: FK CONSTRAINT; Schema: sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY sre_mexican_tramits_system.payment
    ADD CONSTRAINT payment_created_by_fkey FOREIGN KEY (created_by) REFERENCES sre_mexican_tramits_system."user"(id);


--
-- TOC entry 3831 (class 2606 OID 25164)
-- Name: payment_email_by_company payment_email_by_company_company_id_fkey; Type: FK CONSTRAINT; Schema: sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY sre_mexican_tramits_system.payment_email_by_company
    ADD CONSTRAINT payment_email_by_company_company_id_fkey FOREIGN KEY (company_id) REFERENCES sre_mexican_tramits_system.company(id);


--
-- TOC entry 3832 (class 2606 OID 25169)
-- Name: payment_email_by_company payment_email_by_company_payment_email_id_fkey; Type: FK CONSTRAINT; Schema: sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY sre_mexican_tramits_system.payment_email_by_company
    ADD CONSTRAINT payment_email_by_company_payment_email_id_fkey FOREIGN KEY (payment_email_id) REFERENCES sre_mexican_tramits_system.payment_email(id);


--
-- TOC entry 3836 (class 2606 OID 25216)
-- Name: payment_from_email payment_from_email_company_email_id_fkey; Type: FK CONSTRAINT; Schema: sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY sre_mexican_tramits_system.payment_from_email
    ADD CONSTRAINT payment_from_email_company_email_id_fkey FOREIGN KEY (company_email_id) REFERENCES sre_mexican_tramits_system.company_email(id);


--
-- TOC entry 3837 (class 2606 OID 25221)
-- Name: payment_from_email payment_from_email_company_id_fkey; Type: FK CONSTRAINT; Schema: sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY sre_mexican_tramits_system.payment_from_email
    ADD CONSTRAINT payment_from_email_company_id_fkey FOREIGN KEY (company_id) REFERENCES sre_mexican_tramits_system.company(id);


--
-- TOC entry 3838 (class 2606 OID 25231)
-- Name: payment_from_email payment_from_email_confirmed_by_fkey; Type: FK CONSTRAINT; Schema: sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY sre_mexican_tramits_system.payment_from_email
    ADD CONSTRAINT payment_from_email_confirmed_by_fkey FOREIGN KEY (confirmed_by) REFERENCES sre_mexican_tramits_system."user"(id);


--
-- TOC entry 3839 (class 2606 OID 25211)
-- Name: payment_from_email payment_from_email_payment_email_id_fkey; Type: FK CONSTRAINT; Schema: sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY sre_mexican_tramits_system.payment_from_email
    ADD CONSTRAINT payment_from_email_payment_email_id_fkey FOREIGN KEY (payment_email_id) REFERENCES sre_mexican_tramits_system.payment_email(id);


--
-- TOC entry 3840 (class 2606 OID 25226)
-- Name: payment_from_email payment_from_email_payment_id_fkey; Type: FK CONSTRAINT; Schema: sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY sre_mexican_tramits_system.payment_from_email
    ADD CONSTRAINT payment_from_email_payment_id_fkey FOREIGN KEY (payment_id) REFERENCES sre_mexican_tramits_system.payment(id);


--
-- TOC entry 3835 (class 2606 OID 25206)
-- Name: payment payment_payment_from_email_id_fkey; Type: FK CONSTRAINT; Schema: sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY sre_mexican_tramits_system.payment
    ADD CONSTRAINT payment_payment_from_email_id_fkey FOREIGN KEY (payment_from_email_id) REFERENCES sre_mexican_tramits_system.payment_from_email(id);


--
-- TOC entry 3826 (class 2606 OID 16854)
-- Name: user_by_company user_by_company_company_id_fkey; Type: FK CONSTRAINT; Schema: sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY sre_mexican_tramits_system.user_by_company
    ADD CONSTRAINT user_by_company_company_id_fkey FOREIGN KEY (company_id) REFERENCES sre_mexican_tramits_system.company(id);


--
-- TOC entry 3827 (class 2606 OID 16859)
-- Name: user_by_company user_by_company_user_id_fkey; Type: FK CONSTRAINT; Schema: sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY sre_mexican_tramits_system.user_by_company
    ADD CONSTRAINT user_by_company_user_id_fkey FOREIGN KEY (user_id) REFERENCES sre_mexican_tramits_system."user"(id);


--
-- TOC entry 3841 (class 2606 OID 37512)
-- Name: entity entity_annulled_by_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity
    ADD CONSTRAINT entity_annulled_by_fkey FOREIGN KEY (annulled_by) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription_user(id);


--
-- TOC entry 3842 (class 2606 OID 37517)
-- Name: entity entity_created_by_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity
    ADD CONSTRAINT entity_created_by_fkey FOREIGN KEY (created_by) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription_user(id);


--
-- TOC entry 3845 (class 2606 OID 37537)
-- Name: entity_document entity_document_annulled_by_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_document
    ADD CONSTRAINT entity_document_annulled_by_fkey FOREIGN KEY (annulled_by) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription_user(id);


--
-- TOC entry 3849 (class 2606 OID 37557)
-- Name: entity_document_by_entity entity_document_by_entity_annulled_by_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_document_by_entity
    ADD CONSTRAINT entity_document_by_entity_annulled_by_fkey FOREIGN KEY (annulled_by) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription_user(id);


--
-- TOC entry 3850 (class 2606 OID 37562)
-- Name: entity_document_by_entity entity_document_by_entity_created_by_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_document_by_entity
    ADD CONSTRAINT entity_document_by_entity_created_by_fkey FOREIGN KEY (created_by) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription_user(id);


--
-- TOC entry 3851 (class 2606 OID 37567)
-- Name: entity_document_by_entity entity_document_by_entity_entity_document_id_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_document_by_entity
    ADD CONSTRAINT entity_document_by_entity_entity_document_id_fkey FOREIGN KEY (entity_document_id) REFERENCES system_structure_sre_mexican_tramits_system.entity_document(id);


--
-- TOC entry 3852 (class 2606 OID 37572)
-- Name: entity_document_by_entity entity_document_by_entity_entity_id_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_document_by_entity
    ADD CONSTRAINT entity_document_by_entity_entity_id_fkey FOREIGN KEY (entity_id) REFERENCES system_structure_sre_mexican_tramits_system.entity(id);


--
-- TOC entry 3853 (class 2606 OID 37577)
-- Name: entity_document_category entity_document_category_annulled_by_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_document_category
    ADD CONSTRAINT entity_document_category_annulled_by_fkey FOREIGN KEY (annulled_by) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription_user(id);


--
-- TOC entry 3854 (class 2606 OID 37582)
-- Name: entity_document_category entity_document_category_created_by_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_document_category
    ADD CONSTRAINT entity_document_category_created_by_fkey FOREIGN KEY (created_by) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription_user(id);


--
-- TOC entry 3855 (class 2606 OID 37587)
-- Name: entity_document_category entity_document_category_parent_id_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_document_category
    ADD CONSTRAINT entity_document_category_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES system_structure_sre_mexican_tramits_system.entity_document_category(id);


--
-- TOC entry 3846 (class 2606 OID 37542)
-- Name: entity_document entity_document_created_by_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_document
    ADD CONSTRAINT entity_document_created_by_fkey FOREIGN KEY (created_by) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription_user(id);


--
-- TOC entry 3847 (class 2606 OID 37547)
-- Name: entity_document entity_document_entity_document_category_id_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_document
    ADD CONSTRAINT entity_document_entity_document_category_id_fkey FOREIGN KEY (entity_document_category_id) REFERENCES system_structure_sre_mexican_tramits_system.entity_document_category(id);


--
-- TOC entry 3848 (class 2606 OID 37552)
-- Name: entity_document entity_document_entity_id_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_document
    ADD CONSTRAINT entity_document_entity_id_fkey FOREIGN KEY (entity_id) REFERENCES system_structure_sre_mexican_tramits_system.entity(id);


--
-- TOC entry 3856 (class 2606 OID 37592)
-- Name: entity_email entity_email_annulled_by_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_email
    ADD CONSTRAINT entity_email_annulled_by_fkey FOREIGN KEY (annulled_by) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription_user(id);


--
-- TOC entry 3859 (class 2606 OID 37607)
-- Name: entity_email_by_entity entity_email_by_entity_annulled_by_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_email_by_entity
    ADD CONSTRAINT entity_email_by_entity_annulled_by_fkey FOREIGN KEY (annulled_by) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription_user(id);


--
-- TOC entry 3860 (class 2606 OID 37612)
-- Name: entity_email_by_entity entity_email_by_entity_created_by_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_email_by_entity
    ADD CONSTRAINT entity_email_by_entity_created_by_fkey FOREIGN KEY (created_by) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription_user(id);


--
-- TOC entry 3861 (class 2606 OID 37617)
-- Name: entity_email_by_entity entity_email_by_entity_entity_email_id_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_email_by_entity
    ADD CONSTRAINT entity_email_by_entity_entity_email_id_fkey FOREIGN KEY (entity_email_id) REFERENCES system_structure_sre_mexican_tramits_system.entity_email(id);


--
-- TOC entry 3862 (class 2606 OID 37622)
-- Name: entity_email_by_entity entity_email_by_entity_entity_id_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_email_by_entity
    ADD CONSTRAINT entity_email_by_entity_entity_id_fkey FOREIGN KEY (entity_id) REFERENCES system_structure_sre_mexican_tramits_system.entity(id);


--
-- TOC entry 3857 (class 2606 OID 37597)
-- Name: entity_email entity_email_created_by_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_email
    ADD CONSTRAINT entity_email_created_by_fkey FOREIGN KEY (created_by) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription_user(id);


--
-- TOC entry 3858 (class 2606 OID 37602)
-- Name: entity_email entity_email_updated_by_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_email
    ADD CONSTRAINT entity_email_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription_user(id);


--
-- TOC entry 3843 (class 2606 OID 37527)
-- Name: entity entity_inactivated_by_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity
    ADD CONSTRAINT entity_inactivated_by_fkey FOREIGN KEY (inactivated_by) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription_user(id);


--
-- TOC entry 3863 (class 2606 OID 37627)
-- Name: entity_name entity_name_annulled_by_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_name
    ADD CONSTRAINT entity_name_annulled_by_fkey FOREIGN KEY (annulled_by) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription_user(id);


--
-- TOC entry 3866 (class 2606 OID 37642)
-- Name: entity_name_by_entity entity_name_by_entity_annulled_by_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_name_by_entity
    ADD CONSTRAINT entity_name_by_entity_annulled_by_fkey FOREIGN KEY (annulled_by) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription_user(id);


--
-- TOC entry 3867 (class 2606 OID 37647)
-- Name: entity_name_by_entity entity_name_by_entity_created_by_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_name_by_entity
    ADD CONSTRAINT entity_name_by_entity_created_by_fkey FOREIGN KEY (created_by) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription_user(id);


--
-- TOC entry 3868 (class 2606 OID 37652)
-- Name: entity_name_by_entity entity_name_by_entity_entity_id_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_name_by_entity
    ADD CONSTRAINT entity_name_by_entity_entity_id_fkey FOREIGN KEY (entity_id) REFERENCES system_structure_sre_mexican_tramits_system.entity(id);


--
-- TOC entry 3869 (class 2606 OID 37657)
-- Name: entity_name_by_entity entity_name_by_entity_entity_name_id_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_name_by_entity
    ADD CONSTRAINT entity_name_by_entity_entity_name_id_fkey FOREIGN KEY (entity_name_id) REFERENCES system_structure_sre_mexican_tramits_system.entity_name(id);


--
-- TOC entry 3870 (class 2606 OID 37662)
-- Name: entity_name_by_entity entity_name_by_entity_entity_name_type_id_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_name_by_entity
    ADD CONSTRAINT entity_name_by_entity_entity_name_type_id_fkey FOREIGN KEY (entity_name_type_id) REFERENCES system_structure_sre_mexican_tramits_system.entity_name_type(id);


--
-- TOC entry 3864 (class 2606 OID 37632)
-- Name: entity_name entity_name_created_by_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_name
    ADD CONSTRAINT entity_name_created_by_fkey FOREIGN KEY (created_by) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription_user(id);


--
-- TOC entry 3871 (class 2606 OID 37667)
-- Name: entity_name_type entity_name_type_annulled_by_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_name_type
    ADD CONSTRAINT entity_name_type_annulled_by_fkey FOREIGN KEY (annulled_by) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription_user(id);


--
-- TOC entry 3872 (class 2606 OID 37672)
-- Name: entity_name_type entity_name_type_created_by_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_name_type
    ADD CONSTRAINT entity_name_type_created_by_fkey FOREIGN KEY (created_by) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription_user(id);


--
-- TOC entry 3873 (class 2606 OID 37677)
-- Name: entity_name_type entity_name_type_updated_by_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_name_type
    ADD CONSTRAINT entity_name_type_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription_user(id);


--
-- TOC entry 3865 (class 2606 OID 37637)
-- Name: entity_name entity_name_updated_by_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_name
    ADD CONSTRAINT entity_name_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription_user(id);


--
-- TOC entry 3874 (class 2606 OID 37682)
-- Name: entity_phone entity_phone_annulled_by_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_phone
    ADD CONSTRAINT entity_phone_annulled_by_fkey FOREIGN KEY (annulled_by) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription_user(id);


--
-- TOC entry 3877 (class 2606 OID 37697)
-- Name: entity_phone_by_entity entity_phone_by_entity_annulled_by_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_phone_by_entity
    ADD CONSTRAINT entity_phone_by_entity_annulled_by_fkey FOREIGN KEY (annulled_by) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription_user(id);


--
-- TOC entry 3878 (class 2606 OID 37702)
-- Name: entity_phone_by_entity entity_phone_by_entity_created_by_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_phone_by_entity
    ADD CONSTRAINT entity_phone_by_entity_created_by_fkey FOREIGN KEY (created_by) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription_user(id);


--
-- TOC entry 3879 (class 2606 OID 37707)
-- Name: entity_phone_by_entity entity_phone_by_entity_entity_id_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_phone_by_entity
    ADD CONSTRAINT entity_phone_by_entity_entity_id_fkey FOREIGN KEY (entity_id) REFERENCES system_structure_sre_mexican_tramits_system.entity(id);


--
-- TOC entry 3880 (class 2606 OID 37712)
-- Name: entity_phone_by_entity entity_phone_by_entity_entity_phone_id_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_phone_by_entity
    ADD CONSTRAINT entity_phone_by_entity_entity_phone_id_fkey FOREIGN KEY (entity_phone_id) REFERENCES system_structure_sre_mexican_tramits_system.entity_phone(id);


--
-- TOC entry 3875 (class 2606 OID 37687)
-- Name: entity_phone entity_phone_created_by_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_phone
    ADD CONSTRAINT entity_phone_created_by_fkey FOREIGN KEY (created_by) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription_user(id);


--
-- TOC entry 3876 (class 2606 OID 37692)
-- Name: entity_phone entity_phone_updated_by_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_phone
    ADD CONSTRAINT entity_phone_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription_user(id);


--
-- TOC entry 3908 (class 2606 OID 38161)
-- Name: entity_relation entity_relation_annulled_by_fkye; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_relation
    ADD CONSTRAINT entity_relation_annulled_by_fkye FOREIGN KEY (annulled_by) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription_user(id);


--
-- TOC entry 3909 (class 2606 OID 38151)
-- Name: entity_relation entity_relation_created_by_fkye; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_relation
    ADD CONSTRAINT entity_relation_created_by_fkye FOREIGN KEY (created_by) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription_user(id);


--
-- TOC entry 3910 (class 2606 OID 38136)
-- Name: entity_relation entity_relation_entity_id_fkye; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_relation
    ADD CONSTRAINT entity_relation_entity_id_fkye FOREIGN KEY (entity_id) REFERENCES system_structure_sre_mexican_tramits_system.entity(id);


--
-- TOC entry 3911 (class 2606 OID 38141)
-- Name: entity_relation entity_relation_entity_related_id_fkye; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_relation
    ADD CONSTRAINT entity_relation_entity_related_id_fkye FOREIGN KEY (entity_related_id) REFERENCES system_structure_sre_mexican_tramits_system.entity(id);


--
-- TOC entry 3912 (class 2606 OID 38146)
-- Name: entity_relation entity_relation_entity_type_relation_id_fkye; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_relation
    ADD CONSTRAINT entity_relation_entity_type_relation_id_fkye FOREIGN KEY (entity_type_relation_id) REFERENCES system_structure_sre_mexican_tramits_system.entity_type_relation(id);


--
-- TOC entry 3913 (class 2606 OID 38156)
-- Name: entity_relation entity_relation_updated_by_fkye; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_relation
    ADD CONSTRAINT entity_relation_updated_by_fkye FOREIGN KEY (updated_by) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription_user(id);


--
-- TOC entry 3914 (class 2606 OID 38183)
-- Name: entity_type entity_type_annulled_by_fkye; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_type
    ADD CONSTRAINT entity_type_annulled_by_fkye FOREIGN KEY (annulled_by) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription_user(id);


--
-- TOC entry 3903 (class 2606 OID 38129)
-- Name: entity_type_by_entity entity_type_by_entity_annulled_by_fkye; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_type_by_entity
    ADD CONSTRAINT entity_type_by_entity_annulled_by_fkye FOREIGN KEY (annulled_by) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription_user(id);


--
-- TOC entry 3904 (class 2606 OID 38119)
-- Name: entity_type_by_entity entity_type_by_entity_created_by_fkye; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_type_by_entity
    ADD CONSTRAINT entity_type_by_entity_created_by_fkye FOREIGN KEY (created_by) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription_user(id);


--
-- TOC entry 3905 (class 2606 OID 38109)
-- Name: entity_type_by_entity entity_type_by_entity_entity_id_fkye; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_type_by_entity
    ADD CONSTRAINT entity_type_by_entity_entity_id_fkye FOREIGN KEY (entity_id) REFERENCES system_structure_sre_mexican_tramits_system.entity(id);


--
-- TOC entry 3906 (class 2606 OID 38114)
-- Name: entity_type_by_entity entity_type_by_entity_entity_type_id_fkye; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_type_by_entity
    ADD CONSTRAINT entity_type_by_entity_entity_type_id_fkye FOREIGN KEY (entity_type_id) REFERENCES system_structure_sre_mexican_tramits_system.entity_type(id);


--
-- TOC entry 3907 (class 2606 OID 38124)
-- Name: entity_type_by_entity entity_type_by_entity_updated_by_fkye; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_type_by_entity
    ADD CONSTRAINT entity_type_by_entity_updated_by_fkye FOREIGN KEY (updated_by) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription_user(id);


--
-- TOC entry 3915 (class 2606 OID 38173)
-- Name: entity_type entity_type_created_by_fkye; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_type
    ADD CONSTRAINT entity_type_created_by_fkye FOREIGN KEY (created_by) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription_user(id);


--
-- TOC entry 3917 (class 2606 OID 38208)
-- Name: entity_type_relation entity_type_relation_annulled_by_fkye; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_type_relation
    ADD CONSTRAINT entity_type_relation_annulled_by_fkye FOREIGN KEY (annulled_by) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription_user(id);


--
-- TOC entry 3918 (class 2606 OID 38198)
-- Name: entity_type_relation entity_type_relation_created_by_fkye; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_type_relation
    ADD CONSTRAINT entity_type_relation_created_by_fkye FOREIGN KEY (created_by) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription_user(id);


--
-- TOC entry 3919 (class 2606 OID 38188)
-- Name: entity_type_relation entity_type_relation_entity_type_id_fkye; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_type_relation
    ADD CONSTRAINT entity_type_relation_entity_type_id_fkye FOREIGN KEY (entity_type_id) REFERENCES system_structure_sre_mexican_tramits_system.entity_type(id);


--
-- TOC entry 3920 (class 2606 OID 38193)
-- Name: entity_type_relation entity_type_relation_entity_type_related_id_fkye; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_type_relation
    ADD CONSTRAINT entity_type_relation_entity_type_related_id_fkye FOREIGN KEY (entity_type_related_id) REFERENCES system_structure_sre_mexican_tramits_system.entity_type(id);


--
-- TOC entry 3921 (class 2606 OID 38203)
-- Name: entity_type_relation entity_type_relation_updated_by_fkye; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_type_relation
    ADD CONSTRAINT entity_type_relation_updated_by_fkye FOREIGN KEY (updated_by) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription_user(id);


--
-- TOC entry 3916 (class 2606 OID 38178)
-- Name: entity_type entity_type_updated_by_fkye; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity_type
    ADD CONSTRAINT entity_type_updated_by_fkye FOREIGN KEY (updated_by) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription_user(id);


--
-- TOC entry 3844 (class 2606 OID 37532)
-- Name: entity entity_updated_by_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.entity
    ADD CONSTRAINT entity_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription_user(id);


--
-- TOC entry 3881 (class 2606 OID 37717)
-- Name: system system_inactivated_by_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.system
    ADD CONSTRAINT system_inactivated_by_fkey FOREIGN KEY (inactivated_by) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription_user(id);


--
-- TOC entry 3882 (class 2606 OID 37722)
-- Name: system_subscription system_subscription_annulled_by_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.system_subscription
    ADD CONSTRAINT system_subscription_annulled_by_fkey FOREIGN KEY (annulled_by) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription_user(id);


--
-- TOC entry 3883 (class 2606 OID 37727)
-- Name: system_subscription system_subscription_created_by_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.system_subscription
    ADD CONSTRAINT system_subscription_created_by_fkey FOREIGN KEY (created_by) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription_user(id);


--
-- TOC entry 3884 (class 2606 OID 37732)
-- Name: system_subscription system_subscription_entity_id_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.system_subscription
    ADD CONSTRAINT system_subscription_entity_id_fkey FOREIGN KEY (entity_id) REFERENCES system_structure_sre_mexican_tramits_system.entity(id);


--
-- TOC entry 3885 (class 2606 OID 37737)
-- Name: system_subscription system_subscription_inactivated_by_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.system_subscription
    ADD CONSTRAINT system_subscription_inactivated_by_fkey FOREIGN KEY (inactivated_by) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription_user(id);


--
-- TOC entry 3886 (class 2606 OID 37742)
-- Name: system_subscription system_subscription_system_id_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.system_subscription
    ADD CONSTRAINT system_subscription_system_id_fkey FOREIGN KEY (system_id) REFERENCES system_structure_sre_mexican_tramits_system.system(id);


--
-- TOC entry 3887 (class 2606 OID 37747)
-- Name: system_subscription system_subscription_updated_by_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.system_subscription
    ADD CONSTRAINT system_subscription_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription_user(id);


--
-- TOC entry 3888 (class 2606 OID 37752)
-- Name: system_subscription_user system_subscription_user_annulled_by_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.system_subscription_user
    ADD CONSTRAINT system_subscription_user_annulled_by_fkey FOREIGN KEY (annulled_by) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription_user(id);


--
-- TOC entry 3889 (class 2606 OID 37757)
-- Name: system_subscription_user system_subscription_user_created_by_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.system_subscription_user
    ADD CONSTRAINT system_subscription_user_created_by_fkey FOREIGN KEY (created_by) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription_user(id);


--
-- TOC entry 3890 (class 2606 OID 37762)
-- Name: system_subscription_user system_subscription_user_entity_id_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.system_subscription_user
    ADD CONSTRAINT system_subscription_user_entity_id_fkey FOREIGN KEY (entity_id) REFERENCES system_structure_sre_mexican_tramits_system.entity(id);


--
-- TOC entry 3891 (class 2606 OID 37767)
-- Name: system_subscription_user system_subscription_user_inactivated_by_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.system_subscription_user
    ADD CONSTRAINT system_subscription_user_inactivated_by_fkey FOREIGN KEY (inactivated_by) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription_user(id);


--
-- TOC entry 3892 (class 2606 OID 37772)
-- Name: system_subscription_user system_subscription_user_system_subscription_id_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.system_subscription_user
    ADD CONSTRAINT system_subscription_user_system_subscription_id_fkey FOREIGN KEY (system_subscription_id) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription(id);


--
-- TOC entry 3893 (class 2606 OID 37777)
-- Name: unit_measurement unit_measurement_annulled_by_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.unit_measurement
    ADD CONSTRAINT unit_measurement_annulled_by_fkey FOREIGN KEY (annulled_by) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription_user(id);


--
-- TOC entry 3898 (class 2606 OID 37802)
-- Name: unit_measurement_category unit_measurement_category_annulled_by_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.unit_measurement_category
    ADD CONSTRAINT unit_measurement_category_annulled_by_fkey FOREIGN KEY (annulled_by) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription_user(id);


--
-- TOC entry 3899 (class 2606 OID 37807)
-- Name: unit_measurement_category unit_measurement_category_created_by_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.unit_measurement_category
    ADD CONSTRAINT unit_measurement_category_created_by_fkey FOREIGN KEY (created_by) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription_user(id);


--
-- TOC entry 3900 (class 2606 OID 37812)
-- Name: unit_measurement_category unit_measurement_category_parent_id_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.unit_measurement_category
    ADD CONSTRAINT unit_measurement_category_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES system_structure_sre_mexican_tramits_system.unit_measurement_category(id);


--
-- TOC entry 3901 (class 2606 OID 37817)
-- Name: unit_measurement_category unit_measurement_category_system_subscription_id_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.unit_measurement_category
    ADD CONSTRAINT unit_measurement_category_system_subscription_id_fkey FOREIGN KEY (system_subscription_id) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription(id);


--
-- TOC entry 3902 (class 2606 OID 37822)
-- Name: unit_measurement_category unit_measurement_category_updated_by_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.unit_measurement_category
    ADD CONSTRAINT unit_measurement_category_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription_user(id);


--
-- TOC entry 3894 (class 2606 OID 37782)
-- Name: unit_measurement unit_measurement_created_by_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.unit_measurement
    ADD CONSTRAINT unit_measurement_created_by_fkey FOREIGN KEY (created_by) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription_user(id);


--
-- TOC entry 3895 (class 2606 OID 37787)
-- Name: unit_measurement unit_measurement_unit_measurement_base_id_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.unit_measurement
    ADD CONSTRAINT unit_measurement_unit_measurement_base_id_fkey FOREIGN KEY (unit_measurement_base_id) REFERENCES system_structure_sre_mexican_tramits_system.unit_measurement(id);


--
-- TOC entry 3896 (class 2606 OID 37792)
-- Name: unit_measurement unit_measurement_unit_measurement_category_id_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.unit_measurement
    ADD CONSTRAINT unit_measurement_unit_measurement_category_id_fkey FOREIGN KEY (unit_measurement_category_id) REFERENCES system_structure_sre_mexican_tramits_system.unit_measurement_category(id);


--
-- TOC entry 3897 (class 2606 OID 37797)
-- Name: unit_measurement unit_measurement_updated_by_fkey; Type: FK CONSTRAINT; Schema: system_structure_sre_mexican_tramits_system; Owner: postgres
--

ALTER TABLE ONLY system_structure_sre_mexican_tramits_system.unit_measurement
    ADD CONSTRAINT unit_measurement_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES system_structure_sre_mexican_tramits_system.system_subscription_user(id);


-- Completed on 2025-05-16 19:24:29 -04

--
-- PostgreSQL database dump complete
--

