export * from "@resolver/redefined.resolver";
export * from "@resolver/models/types";
export * from "@resolver/services/resolvers/resolver.service";
export * from "@resolver/services/abis/redefined-email-resolver.abi";
export * from "@resolver/services/abis/redefined-nickname-resolver.abi";
export * from "@resolver/config";
import config from "@resolver/config"

export function updateConfig(params: { emailContract?: string, nicknameContract?: string }) {
    if (params.emailContract)
        config.REDEFINED_EMAIL_RESOLVER_CONTRACT_ADDRESS = params.emailContract;
    
    if (params.nicknameContract)
        config.REDEFINED_NICKNAME_RESOLVER_CONTRACT_ADDRESS = params.nicknameContract;
}
