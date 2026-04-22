| team_name | tier | formation | season | note     | team_id | members_id | position | general_img | general_name | skill_1  | skill_1_alt | skill_2  | skill_2_alt | soldier_type | soldier_skills | book_1  | book_2 | book_3 | equip_point | equip_stats | horse_stats | plus_points        |
| --------- | ---- | --------- | ------ | -------- | ------- | ---------- | -------- | ----------- | ------------ | -------- | ----------- | -------- | ----------- | ------------ | -------------- | ------- | ------ | ------ | ----------- | ----------- | ----------- | ------------------ |
| 荀皇陸    | T0.3 | 箕形陣    | s2     | 如有備註 | 1       | 1          | 1        | cao_cao.png | 曹操         | 避其銳氣 | null        | 青囊急救 | null        | 重盾兵       | 屹然不動       | 金·上卷 | 兵令   | 合謀   | 智力統率    | 先禦、鐵壁  | 君臨        | 全智               |
| 荀皇陸    | T0.3 | 箕形陣    | s2     | 如有備註 | 1       | 2          | 2        | lu_xun.png  | 陸遜         | 韜光養晦 | null        | 出其不意 | null        | 矛兵         | 負堅執銳       | 金·焚營 | 鬼謀   | 勵心   | 智力統率    | 先禦、靈光  | 穿雲、照影  | 全智               |
| 荀皇陸    | T0.3 | 箕形陣    | s2     | 如有備註 | 1       | 3          | 3        | xun_yu.png  | 荀彧         | 烈火焚營 | null        | 清風驅疾 | null        | 長弓兵       | 袍澤同心       | 金·復漢 | 機動   | 勵心   | 智力先攻    | 先禦、鐵壁  | 君臨        | 速度第一，其餘全智 |

前端查詢結果應該要以表格的方式顯示每個陣容的以下內容:

1. team_name
2. formation
3. 由左到右，依據 position 1~3 排列三位武將的圖片，在每個武將的那一列顯示除了"tier、season、note、team_id、members_id、position之外的其他對應資料

已實作:

- 每個 team 以一列顯示，包含 tier、team_name、formation
- 三位武將由左至右按 position 1~3 排列
- 每位武將顯示: 圖片、name、soldier_type、soldier_skills、skill_1(+alt)、skill_2(+alt)、書籍、加點
