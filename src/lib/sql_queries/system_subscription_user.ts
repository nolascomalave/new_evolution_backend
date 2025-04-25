import { escape } from "querystring";

type GetAllUsersParams = {
    user_id?: string | string | null,
    system_id?: string | string | null,
    system_subscription_id?: string | string | null,
    system_subscription_user_id?: string | string | null,
    annulled?: boolean | null,
}

export type User = {
    id: string;
    system_id: string;
    system_subscription_id: string;
    entity_id: string;
    system_subscription_user_id: string;
    username: string;
    password: string;
    name?: string | null;
    complete_name: string;
    names: string | null;
    surnames: string | null;
    phones: string | null;
    emails: string | null;
    is_admin: number | boolean;
    annulled_at_system?: string | null;
    annulled_at_system_subscription?: string | null;
    annulled_at_system_subscription_user?: string | null;
    annulled_by_system_subscription?: string | null;
    annulled_by_system_subscription_user?: string | null;
    annulled_at?: string | null;
    annulled_by?: number | null;
}

export function getAllUsers({params = {}, __limit, __page}: {params?: GetAllUsersParams, __limit?: string | number, __page?: string | number}): string {
    let test = /[^\d]/g;
    let where: string | string[] = [];

    let limitString: string = '';

    if(__limit !== undefined && __page !== undefined) {
        limitString = (!(test.test(__limit.toString())) && !(test.test(__page.toString()))) ? `LIMIT ${__limit} offset ${(Number(__page) - 1) * Number(__limit)}` : '';
    }

    if((params.user_id ?? params.system_subscription_user_id ?? null) !== null) {
        where.push(`ssu.id = '${escape(params.user_id ?? params.system_subscription_user_id)}'`);
    }

    if((params.system_id ?? null) !== null) {
        where.push(`sys.id = '${escape(params.system_id)}'`);
    }

    if((params.system_subscription_id ?? null) !== null) {
        where.push(`ss.id = '${escape(params.system_subscription_id)}'`);
    }

    if((params.annulled ?? null) !== null) {
        where.push(`COALESCE(sys.annulled_at, ss.annulled_at, ssu.annulled_at) IS ${params.annulled === true ? 'NOT' : ''} NULL`);
    }

    where = where.length > 0 ? ("AND " + where.join("\nAND ")) : '';

    return `SELECT
        ssu.id,
        ss.system_id,
        ssu.system_subscription_id,
        ssu.entity_id,
        ssu.id AS system_subscription_user_id,
        ssu.username,
        ssu.password,
        ent.name,
        TRIM(CONCAT(IF(names.name IS NULL, '', names.name), ' ', IF(surnames.name IS NULL, '', surnames.name))) AS complete_name,
        names.name AS names,
        surnames.name AS surnames,
        IF(COALESCE(ede.quantity, 0) < 1, NULL, CONCAT('[', ede.documents, ']')) AS documents,
        IF(epc.phones IS NULL, NULL, CONCAT('[', epc.phones, ']')) AS phones,
        IF(eec.emails IS NULL, NULL, CONCAT('[', eec.emails, ']')) AS emails,
        IF(ssu.created_by IS NULL, 1, 0) AS is_admin,
        sys.annulled_at AS annulled_at_system,
        ss.annulled_at AS annulled_at_system_subscription,
        ssu.annulled_at AS annulled_at_system_subscription_user,
        ss.annulled_by AS annulled_by_system_subscription,
        ssu.annulled_by AS annulled_by_system_subscription_user,
        LEAST(sys.annulled_at, ss.annulled_at, ssu.annulled_at) AS annulled_at,
        CASE
            WHEN (ss.annulled_at IS NOT NULL AND ss.annulled_at = LEAST(sys.annulled_at, ss.annulled_at, ssu.annulled_at)) THEN ss.annulled_at
            WHEN (ssu.annulled_at IS NOT NULL AND ssu.annulled_at = LEAST(sys.annulled_at, ss.annulled_at, ssu.annulled_at)) THEN ssu.annulled_at
            ELSE NULL
        END AS annulled_by
    FROM system_subscription_user ssu
    INNER JOIN system_subscription ss
        ON ss.id = ssu.system_subscription_id
    INNER JOIN "system" sys
        ON sys.id = ss.system_id
    INNER JOIN entity ent
        ON ent.id = ssu.entity_id
    LEFT JOIN entity_documents_by_entity ede
        ON ede.entity_id = ssu.entity_id
    LEFT JOIN entity_names_concat_by_type names
        ON names.entity_id = ent.id
        AND names.type = 'Name'
    LEFT JOIN entity_names_concat_by_type surnames
        ON surnames.entity_id = ent.id
        AND surnames.type = 'Surname'
    LEFT JOIN entity_phones_concat epc
        ON epc.entity_id = ent.id
    LEFT JOIN entity_emails_concat eec
        ON eec.entity_id = ent.id
    WHERE COALESCE(ss.annulled_at, sys.annulled_at, ssu.annulled_at, ent.annulled_at) IS NULL
        AND COALESCE(names.name, surnames.name) IS NOT NULL
        ${where}
    ${limitString}`;
}