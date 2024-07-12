type GetAllUsersParams = {
    id_user?: number | string | null,
    id_system?: number | string | null,
    id_system_subscription?: number | string | null,
    id_system_subscription_user?: number | string | null,
    annulled?: boolean | null,
}

export type User = {
    id: number;
    id_system: number;
    id_system_subscription: number;
    id_entity: number;
    id_system_subscription_user: number;
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
    annulled_by_system_subscription?: number | null;
    annulled_by_system_subscription_user?: number | null;
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

    if((params.id_user ?? params.id_system_subscription_user ?? null) !== null) {
        where.push(`ssu.id = ${params.id_user ?? params.id_system_subscription_user}`);
    }

    if((params.id_system ?? null) !== null) {
        where.push(`sys.id = ${params.id_system}`);
    }

    if((params.id_system_subscription ?? null) !== null) {
        where.push(`ss.id = ${params.id_system_subscription}`);
    }

    if((params.annulled ?? null) !== null) {
        where.push(`COALESCE(sys.annulled_at, ss.annulled_at, ssu.annulled_at) IS ${params.annulled === true ? 'NOT' : ''} NULL`);
    }

    where = where.length > 0 ? ("AND " + where.join("\nAND ")) : '';

    return `SELECT
        ssu.id,
        ss.id_system,
        ssu.id_system_subscription,
        ssu.id_entity,
        ssu.id AS id_system_subscription_user,
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
        ON ss.id = ssu.id_system_subscription
    INNER JOIN \`system\` sys
        ON sys.id = ss.id_system
    INNER JOIN entity ent
        ON ent.id = ssu.id_entity
    LEFT JOIN entity_documents_by_entity ede
        ON ede.id_entity = ssu.id_entity
    LEFT JOIN entity_names_concat_by_type names
        ON names.id_entity = ent.id
        AND names.type = 'Name'
    LEFT JOIN entity_names_concat_by_type surnames
        ON surnames.id_entity = ent.id
        AND surnames.type = 'Surname'
    LEFT JOIN entity_phones_concat epc
        ON epc.id_entity = ent.id
    LEFT JOIN entity_emails_concat eec
        ON eec.id_entity = ent.id
    WHERE COALESCE(ss.annulled_at, sys.annulled_at, ssu.annulled_at, ent.annulled_at) IS NULL
        AND COALESCE(names.name, surnames.name) IS NOT NULL
        ${where}
    ${limitString}`;
}