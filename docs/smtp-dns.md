# SMTP DNS Configuration Guide for SynapseCore Systems

This guide explains the DNS records required to ensure reliable email delivery for `noreply@synapsecoresystems.com`.

1) SPF (Sender Policy Framework)

- Purpose: Declares which mail servers are permitted to send email on behalf of your domain.
- DNS record type: TXT
- Example value (Resend):
  v=spf1 include:spf.resend.com -all
- Example value (SendGrid):
  v=spf1 include:sendgrid.net -all
- Notes: Use the SPF include value provided by your SMTP provider. Avoid multiple `v=spf1` records — consolidate into a single TXT entry.

2) DKIM (DomainKeys Identified Mail)

- Purpose: Cryptographic signing of outgoing email to prove authenticity.
- DNS record type: TXT (selector._domainkey.yourdomain)
- How to obtain: Your SMTP provider (Resend/SendGrid/SES) will provide DKIM selector(s) and TXT values.
- Example entry name: `resend._domainkey` or `s1._domainkey` depending on provider
- Notes: DKIM may require 1 or 2 records; follow provider instructions and verify via dashboard.

3) DMARC (Domain-based Message Authentication, Reporting & Conformance)

- Purpose: Policy that tells receivers what to do with unauthenticated mail and where to send aggregate reports.
- DNS record type: TXT
- Example value (monitoring mode):
  v=DMARC1; p=none; rua=mailto:dmarc-aggregate@synapsecoresystems.com; ruf=mailto:dmarc-forensics@synapsecoresystems.com; pct=100
- Example value (enforce):
  v=DMARC1; p=quarantine; pct=100; rua=mailto:dmarc-aggregate@synapsecoresystems.com
- Notes: Start with `p=none` to monitor, then move to `quarantine` or `reject` after DKIM/SPF are stable.

4) BIMI (optional)

- Purpose: Brand Indicators for Message Identification — displays your logo in supporting inboxes.
- Steps: You need a validated DMARC (p=quarantine or p=reject) and a hosted SVG logo. Configure a DNS TXT and a BIMI record pointing to the logo URL.

5) Domain verification

- Many providers require you to add TXT records for domain verification. Follow the provider's dashboard instructions; these are usually short-lived until verification completes.

6) Testing and verification

- Use tools such as:
  - https://mxtoolbox.com for SPF/DKIM/DMARC checks
  - https://dmarcian.com for DMARC reporting
  - Your SMTP provider's verification tools

7) Example combined workflow

1. Add SPF TXT record using provider include.
2. Add DKIM TXT records from provider.
3. Wait for DNS propagation (minutes → hours).
4. Verify DKIM signature from provider dashboard.
5. Configure Supabase Auth Custom SMTP to use the same SMTP relay and verify sending a test email.
6. Monitor DMARC reports and inbox placement.

If you want, I can generate the exact DNS entries for `synapsecoresystems.com` once you provide the chosen SMTP provider (Resend, SendGrid, SES, etc.) and any required selectors returned by the provider.
